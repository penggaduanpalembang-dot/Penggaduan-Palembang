import { Complaint, Officer, Manager, ActivityLog } from "../types";

const HEADERS_COMPLAINTS = [
  "ID_PENGADUAN", "TGL_PENGADUAN", "NAMA_PELAPOR", "HP", "NO_BERKAS", 
  "PETUGAS_LAPANGAN", "JENIS_LAYANAN", "KATEGORI", "URAIAN", "FOTO_BUKTI", 
  "STATUS", "MANAGER_VERIFIKASI", "TGL_VERIFIKASI", "PETUGAS_PENANGGUNG_JAWAB", 
  "TGL_TINDAKLANJUT", "KENDALA", "ANALISIS", "TINDAKAN", "TARGET_SELESAI", 
  "BUKTI_TINDAKLANJUT", "HASIL_PENYELESAIAN", "TGL_SELESAI"
];

const HEADERS_OFFICERS = [
  "ID_PETUGAS", "NAMA_PETUGAS", "JABATAN", "UNIT_KERJA", "EMAIL", "STATUS"
];

const HEADERS_MANAGERS = [
  "ID_MANAGER", "NAMA_MANAGER", "EMAIL", "JABATAN"
];

const HEADERS_LOGS = [
  "TANGGAL", "USER", "AKTIVITAS", "ID_PENGADUAN", "KETERANGAN"
];

// Helper to convert objects to spreadsheet rows
function objectToRow(obj: any, headers: string[]): any[] {
  return headers.map(header => {
    const val = obj[header];
    if (val === undefined || val === null) return "";
    return typeof val === "object" ? JSON.stringify(val) : String(val);
  });
}

// Helper to convert rows back to objects
function rowToObject(row: any[], headers: string[]): any {
  const obj: any = {};
  headers.forEach((header, index) => {
    let val = row[index];
    if (val === undefined || val === null) {
      obj[header] = "";
    } else {
      val = String(val);
      // Simple parse if it looks like serialized JSON
      if ((val.startsWith("{") && val.endsWith("}")) || (val.startsWith("[") && val.endsWith("]"))) {
        try {
          obj[header] = JSON.parse(val);
        } catch {
          obj[header] = val;
        }
      } else {
        obj[header] = val;
      }
    }
  });
  return obj;
}

// Create a new spreadsheet with tabs
export async function createDatabaseSpreadsheet(token: string, title = "Database Pengaduan Pertanahan BPN Palembang"): Promise<{ spreadsheetId: string; url: string }> {
  const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      properties: {
        title: title
      },
      sheets: [
        { properties: { title: "DATA_PENGADUAN" } },
        { properties: { title: "MASTER_PETUGAS" } },
        { properties: { title: "MASTER_MANAGER" } },
        { properties: { title: "LOG_AKTIVITAS" } }
      ]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || "Gagal membuat spreadsheet baru.");
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  const url = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Write initial headers
  await syncToGoogleSheets(token, spreadsheetId, {
    complaints: [],
    officers: [],
    managers: [],
    logs: []
  }, true);

  return { spreadsheetId, url };
}

// Check spreadsheet tabs, and append missing ones
export async function verifyAndSetupSheets(token: string, spreadsheetId: string): Promise<void> {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || "Spreadsheet tidak ditemukan atau tidak memiliki akses.");
  }

  const metadata = await response.json();
  const existingTitles = metadata.sheets?.map((s: any) => s.properties?.title) || [];
  
  const requiredTabs = ["DATA_PENGADUAN", "MASTER_PETUGAS", "MASTER_MANAGER", "LOG_AKTIVITAS"];
  const requests: any[] = [];

  requiredTabs.forEach(tab => {
    if (!existingTitles.includes(tab)) {
      requests.push({
        addSheet: {
          properties: {
            title: tab
          }
        }
      });
    }
  });

  if (requests.length > 0) {
    const updateResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ requests })
    });

    if (!updateResponse.ok) {
      const err = await updateResponse.json().catch(() => ({}));
      throw new Error(err.error?.message || "Gagal membuat tab pendukung di spreadsheet Anda.");
    }
  }
}

// Synchronize all local storage tables with the remote Google Sheets
export async function syncToGoogleSheets(
  token: string, 
  spreadsheetId: string, 
  data: {
    complaints: Complaint[];
    officers: Officer[];
    managers: Manager[];
    logs: ActivityLog[];
  },
  headersOnly = false
): Promise<void> {
  // First verify and create tabs if they do not exist
  if (!headersOnly) {
    await verifyAndSetupSheets(token, spreadsheetId);
  }

  const prepData = (headers: string[], items: any[]) => {
    const rows = [headers];
    if (!headersOnly) {
      items.forEach(item => {
        rows.push(objectToRow(item, headers));
      });
    }
    return rows;
  };

  const body = {
    valueInputOption: "USER_ENTERED",
    data: [
      {
        range: "DATA_PENGADUAN!A1:Z1000",
        values: prepData(HEADERS_COMPLAINTS, data.complaints)
      },
      {
        range: "MASTER_PETUGAS!A1:Z1000",
        values: prepData(HEADERS_OFFICERS, data.officers)
      },
      {
        range: "MASTER_MANAGER!A1:Z1000",
        values: prepData(HEADERS_MANAGERS, data.managers)
      },
      {
        range: "LOG_AKTIVITAS!A1:Z1000",
        values: prepData(HEADERS_LOGS, data.logs)
      }
    ]
  };

  // We clear old ranges first or do a batch update directly.
  // Overwriting is cleanest since we query A1:Z1000, but we should clear tabs before writing to prevent leftover rows.
  const clearResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchClear`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ranges: ["DATA_PENGADUAN!A1:Z1000", "MASTER_PETUGAS!A1:Z1000", "MASTER_MANAGER!A1:Z1000", "LOG_AKTIVITAS!A1:Z1000"]
    })
  });

  if (!clearResponse.ok) {
    console.warn("Gagal membersihkan baris lama di spreadsheet, melanjutkan penulisan.");
  }

  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || "Gagal menyinkronkan data ke Google Sheets.");
  }
}

// Load data from Google Sheets
export async function loadFromGoogleSheets(
  token: string,
  spreadsheetId: string
): Promise<{
  complaints: Complaint[];
  officers: Officer[];
  managers: Manager[];
  logs: ActivityLog[];
}> {
  await verifyAndSetupSheets(token, spreadsheetId);

  const ranges = ["DATA_PENGADUAN!A1:Z1000", "MASTER_PETUGAS!A1:Z1000", "MASTER_MANAGER!A1:Z1000", "LOG_AKTIVITAS!A1:Z1000"];
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?ranges=${ranges.map(encodeURIComponent).join("&")}`;

  const response = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || "Gagal mengambil data dari Google Sheets.");
  }

  const data = await response.json();
  const valueRanges = data.valueRanges || [];

  const getParsedData = (index: number, headers: string[]) => {
    const values = valueRanges[index]?.values || [];
    if (values.length <= 1) return []; // Empty or only headers
    
    const rows = values.slice(1);
    return rows.map((row: any[]) => rowToObject(row, headers));
  };

  const complaints = getParsedData(0, HEADERS_COMPLAINTS) as Complaint[];
  const officers = getParsedData(1, HEADERS_OFFICERS) as Officer[];
  const managers = getParsedData(2, HEADERS_MANAGERS) as Manager[];
  const logs = getParsedData(3, HEADERS_LOGS) as ActivityLog[];

  return { complaints, officers, managers, logs };
}
