import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDocs, 
  collection, 
  writeBatch,
  getDocFromServer,
  deleteDoc
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { Complaint, Officer, Manager, ActivityLog } from "../types";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth(app);

// Test connection on boot as mandated by the firebase-integration skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Push all local data (complaints, officers, managers, logs) to Firestore
export async function pushDataToFirestore(data: {
  complaints: Complaint[];
  officers: Officer[];
  managers: Manager[];
  logs: ActivityLog[];
}) {
  try {
    // 1. Sync complaints
    for (const item of data.complaints) {
      const ref = doc(db, "complaints", item.ID_PENGADUAN);
      await setDoc(ref, item);
    }
    // 2. Sync officers
    for (const item of data.officers) {
      const ref = doc(db, "officers", item.ID_PETUGAS);
      await setDoc(ref, item);
    }
    // 3. Sync managers
    for (const item of data.managers) {
      const ref = doc(db, "managers", item.ID_MANAGER);
      await setDoc(ref, item);
    }
    // 4. Sync logs - use timestamp or unique string as doc ID
    for (const item of data.logs) {
      const logId = `LOG-${item.TANGGAL.replace(/[:\-\s]/g, "")}-${item.ID_PENGADUAN}`;
      const ref = doc(db, "logs", logId);
      await setDoc(ref, item);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "bulk-sync");
  }
}

// Pull all data from Firestore
export async function pullDataFromFirestore(): Promise<{
  complaints: Complaint[];
  officers: Officer[];
  managers: Manager[];
  logs: ActivityLog[];
}> {
  try {
    const complaintsCol = await getDocs(collection(db, "complaints"));
    const complaints: Complaint[] = [];
    complaintsCol.forEach((doc) => {
      complaints.push(doc.data() as Complaint);
    });

    const officersCol = await getDocs(collection(db, "officers"));
    const officers: Officer[] = [];
    officersCol.forEach((doc) => {
      officers.push(doc.data() as Officer);
    });

    const managersCol = await getDocs(collection(db, "managers"));
    const managers: Manager[] = [];
    managersCol.forEach((doc) => {
      managers.push(doc.data() as Manager);
    });

    const logsCol = await getDocs(collection(db, "logs"));
    const logs: ActivityLog[] = [];
    logsCol.forEach((doc) => {
      logs.push(doc.data() as ActivityLog);
    });

    // Sort logs by TANGGAL descending/ascending if needed
    logs.sort((a, b) => b.TANGGAL.localeCompare(a.TANGGAL));

    return { complaints, officers, managers, logs };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, "bulk-pull");
    return { complaints: [], officers: [], managers: [], logs: [] };
  }
}
