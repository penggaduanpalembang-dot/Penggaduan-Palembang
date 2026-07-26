import { useState } from "react";
import { UserCheck, ShieldAlert, Check, X, FileText, AlertCircle, RefreshCw } from "lucide-react";
import { Complaint, Officer, Manager, StatusPengaduan } from "../types";

interface ManagerActionsProps {
  complaints: Complaint[];
  officers: Officer[];
  managers: Manager[];
  onUpdateComplaint: (updated: Complaint) => void;
  onAddActivityLog: (activity: string, id: string, detail: string) => void;
  onTriggerNotification: (title: string, body: string, type: "manager" | "officer" | "public") => void;
}

export default function ManagerActions({
  complaints,
  officers,
  managers,
  onUpdateComplaint,
  onAddActivityLog,
  onTriggerNotification
}: ManagerActionsProps) {
  const [processingComplaint, setProcessingComplaint] = useState<Complaint | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [editNoBerkas, setEditNoBerkas] = useState("");
  const [editPetugasLap, setEditPetugasLap] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [validationError, setValidationError] = useState("");

  // Only show complaints that need verification
  const pendingComplaints = complaints.filter(
    (c) => c.STATUS === StatusPengaduan.MenungguVerifikasi
  );

  const activeOfficers = officers.filter((o) => o.STATUS === "Aktif");

  const startProcessing = (complaint: Complaint) => {
    setProcessingComplaint(complaint);
    setEditNoBerkas(complaint.NO_BERKAS);
    setEditPetugasLap(complaint.PETUGAS_LAPANGAN);
    setActionType(null);
    setValidationError("");
    setSelectedOfficer(activeOfficers[0]?.NAMA_PETUGAS || "");
    setSelectedManager(managers[0]?.NAMA_MANAGER || "");
  };

  const cancelProcessing = () => {
    setProcessingComplaint(null);
    setActionType(null);
    setRejectionReason("");
    setValidationError("");
  };

  const handleApprove = () => {
    if (!processingComplaint) return;
    if (!selectedOfficer) {
      setValidationError("Anda harus menugaskan Petugas Penanggung Jawab");
      return;
    }
    if (!selectedManager) {
      setValidationError("Nama Manager Verifikator harus dipilih");
      return;
    }
    if (!editNoBerkas.trim()) {
      setValidationError("Nomor berkas tidak boleh kosong");
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];

    const updated: Complaint = {
      ...processingComplaint,
      STATUS: StatusPengaduan.DiverifikasiManagerLoket,
      NO_BERKAS: editNoBerkas,
      PETUGAS_LAPANGAN: editPetugasLap || "Tidak Ada",
      MANAGER_VERIFIKASI: selectedManager,
      TGL_VERIFIKASI: todayStr,
      PETUGAS_PENANGGUNG_JAWAB: selectedOfficer
    };

    onUpdateComplaint(updated);
    
    // Add activity log
    onAddActivityLog(
      `${selectedManager} (Manager)`,
      processingComplaint.ID_PENGADUAN,
      `Menyetujui pengaduan & menugaskan kepada ${selectedOfficer}`
    );

    // Trigger Notification to Petugas Penanggung Jawab
    onTriggerNotification(
      "Tugas Pengaduan Baru",
      `Pengaduan ${processingComplaint.ID_PENGADUAN} telah didelegasikan kepada Anda. Harap segera mengisi rencana tindak lanjut.`,
      "officer"
    );

    cancelProcessing();
  };

  const handleReject = () => {
    if (!processingComplaint) return;
    if (!rejectionReason.trim() || rejectionReason.trim().length < 10) {
      setValidationError("Alasan penolakan harus diisi (minimal 10 karakter)");
      return;
    }
    if (!selectedManager) {
      setValidationError("Nama Manager Verifikator harus dipilih");
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];

    const updated: Complaint = {
      ...processingComplaint,
      STATUS: StatusPengaduan.Ditolak,
      MANAGER_VERIFIKASI: selectedManager,
      TGL_VERIFIKASI: todayStr,
      HASIL_PENYELESAIAN: rejectionReason,
      TGL_SELESAI: todayStr
    };

    onUpdateComplaint(updated);

    // Add activity log
    onAddActivityLog(
      `${selectedManager} (Manager)`,
      processingComplaint.ID_PENGADUAN,
      `Menolak pengaduan. Alasan: ${rejectionReason}`
    );

    // Trigger Notification to Pelapor
    onTriggerNotification(
      "Pengaduan Ditolak",
      `Mohon maaf, pengaduan Anda (${processingComplaint.ID_PENGADUAN}) ditolak. Alasan: ${rejectionReason}`,
      "public"
    );

    cancelProcessing();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-slate-950 pb-5">
        <div>
          <h3 className="font-display text-xl font-black text-slate-900 uppercase tracking-tight">Verifikasi Manager Loket</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 leading-tight">Melihat, memverifikasi, dan menetapkan penanggung jawab pengaduan baru</p>
        </div>
        <div className="bg-yellow-400 border-2 border-slate-950 text-slate-900 px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-900 stroke-[3]" />
          <span>{pendingComplaints.length} Antrean Baru</span>
        </div>
      </div>

      {pendingComplaints.length === 0 && !processingComplaint ? (
        <div className="bg-white rounded-3xl border-2 border-slate-950 p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <UserCheck className="w-16 h-16 text-slate-900 mx-auto mb-4 stroke-[2]" />
          <h4 className="font-display text-base font-black text-slate-800 uppercase tracking-tight">Semua Berkas Bersih!</h4>
          <p className="text-xs max-w-sm mx-auto mt-2 font-bold text-slate-500 uppercase tracking-wide">Tidak ada pengaduan masyarakat baru yang sedang menunggu verifikasi saat ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* List of pending complaints */}
          <div className={`${processingComplaint ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-4`}>
            {pendingComplaints.map((c) => {
              const isSelected = processingComplaint?.ID_PENGADUAN === c.ID_PENGADUAN;
              return (
                <div 
                  key={c.ID_PENGADUAN}
                  className={`bg-white rounded-2xl border-2 border-slate-950 p-5 transition-all duration-300 relative 
                    ${isSelected 
                      ? 'bg-yellow-400/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                      : 'hover:bg-slate-50 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                    }
                  `}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-mono text-[10px] font-black text-slate-950 bg-yellow-400 border border-slate-950 px-2 py-0.5 rounded">{c.ID_PENGADUAN}</span>
                    <span className="text-[10px] text-slate-500 font-mono font-bold">{c.TGL_PENGADUAN}</span>
                  </div>
                  <h4 className="font-black text-xs text-slate-900 mt-3 uppercase tracking-tight">Pelapor: {c.NAMA_PELAPOR}</h4>
                  <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">Layanan: <span className="font-black text-slate-800">{c.JENIS_LAYANAN}</span></p>
                  <p className="text-[11px] text-slate-800 line-clamp-2 bg-slate-50 border border-slate-950 p-2.5 rounded-lg mt-3 text-justify font-bold">{c.URAIAN}</p>
                  
                  {!isSelected && (
                    <div className="mt-4 flex justify-end">
                      <button 
                        onClick={() => startProcessing(c)}
                        className="bg-slate-900 hover:bg-slate-850 text-white font-black uppercase tracking-widest rounded-xl px-4 py-2 text-[10px] border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
                      >
                        Tinjau & Verifikasi
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Panel */}
          {processingComplaint && (
            <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-slate-950 p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              
              <div className="space-y-5">
                <div className="flex justify-between items-center border-b-2 border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Memproses Laporan:</span>
                    <h4 className="font-mono text-base font-black text-slate-900">{processingComplaint.ID_PENGADUAN}</h4>
                  </div>
                  <button 
                    onClick={cancelProcessing}
                    className="p-1.5 border-2 border-slate-950 hover:bg-slate-100 text-slate-950 rounded-xl"
                  >
                    <X className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Complaint Info Block */}
                <div className="bg-slate-50 border-2 border-slate-950 rounded-2xl p-4 text-xs space-y-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="grid grid-cols-2 gap-3 font-bold">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Nama Pelapor</p>
                      <p className="font-black text-slate-900">{processingComplaint.NAMA_PELAPOR}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">No. HP Pelapor</p>
                      <p className="font-mono font-black text-slate-900">{processingComplaint.HP}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">No. Berkas Lama</p>
                      <p className="font-mono font-black text-slate-900">{processingComplaint.NO_BERKAS}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Petugas Lapangan</p>
                      <p className="font-black text-slate-900">{processingComplaint.PETUGAS_LAPANGAN || "-"}</p>
                    </div>
                  </div>
                  <div className="border-t-2 border-slate-200/50 pt-2.5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Uraian Masalah</p>
                    <p className="text-slate-800 leading-relaxed font-semibold text-justify mt-0.5">{processingComplaint.URAIAN}</p>
                  </div>
                </div>

                {/* Validation Error */}
                {validationError && (
                  <div className="bg-rose-50 border-2 border-rose-400 rounded-xl p-3 text-rose-700 text-xs flex items-center gap-1.5 font-bold uppercase tracking-wide">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 stroke-[2.5]" />
                    <span>{validationError}</span>
                  </div>
                )}

                {/* Form Setup */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1.5">Nama Manager Verifikator <span className="text-rose-500">*</span></label>
                    <select 
                      value={selectedManager}
                      onChange={(e) => {
                        setSelectedManager(e.target.value);
                        setValidationError("");
                      }}
                      className="w-full bg-slate-50 border-2 border-slate-950 rounded-xl px-3 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-yellow-400 cursor-pointer"
                    >
                      {managers.map((m) => (
                        <option key={m.ID_MANAGER} value={m.NAMA_MANAGER}>{m.NAMA_MANAGER} ({m.JABATAN})</option>
                      ))}
                    </select>
                  </div>

                  {/* Decision Type Switch */}
                  {!actionType && (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <button 
                        type="button"
                        onClick={() => {
                          setActionType("approve");
                          setValidationError("");
                        }}
                        className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 border-2 border-slate-950 font-black rounded-2xl py-3.5 flex items-center justify-center gap-2 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span className="uppercase tracking-wider text-xs font-black">Setujui Laporan</span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => {
                          setActionType("reject");
                          setValidationError("");
                        }}
                        className="bg-white hover:bg-slate-50 text-rose-600 border-2 border-slate-950 font-black rounded-2xl py-3.5 flex items-center justify-center gap-2 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                      >
                        <X className="w-4 h-4 stroke-[3]" />
                        <span className="uppercase tracking-wider text-xs font-black">Tolak Laporan</span>
                      </button>
                    </div>
                  )}

                  {/* Approve Sub-form */}
                  {actionType === "approve" && (
                    <div className="border-2 border-slate-950 bg-yellow-400/10 rounded-2xl p-5 space-y-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex justify-between items-center pb-1 border-b border-slate-950/25">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Aksi: Verifikasi & Pengesahan Berkas</span>
                        <button onClick={() => setActionType(null)} className="text-[10px] font-black text-rose-600 hover:underline uppercase tracking-widest">Ganti Keputusan</button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Verifikasi No. Berkas BPN</label>
                          <input 
                            type="text"
                            value={editNoBerkas}
                            onChange={(e) => setEditNoBerkas(e.target.value)}
                            className="w-full bg-white border-2 border-slate-950 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Nama Petugas Lapangan</label>
                          <input 
                            type="text"
                            value={editPetugasLap}
                            onChange={(e) => setEditPetugasLap(e.target.value)}
                            className="w-full bg-white border-2 border-slate-950 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1.5">Pilih Petugas Penanggung Jawab (SLA PJ) <span className="text-rose-500">*</span></label>
                        <select 
                          value={selectedOfficer}
                          onChange={(e) => {
                            setSelectedOfficer(e.target.value);
                            setValidationError("");
                          }}
                          className="w-full bg-white border-2 border-slate-950 rounded-xl px-3 py-2.5 text-xs font-bold cursor-pointer focus:ring-2 focus:ring-yellow-400"
                        >
                          {activeOfficers.map((o) => (
                            <option key={o.ID_PETUGAS} value={o.NAMA_PETUGAS}>{o.NAMA_PETUGAS} - {o.JABATAN}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Reject Sub-form */}
                  {actionType === "reject" && (
                    <div className="border-2 border-slate-950 bg-rose-400/10 rounded-2xl p-5 space-y-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex justify-between items-center pb-1 border-b border-slate-950/25">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Aksi: Penolakan Pengaduan</span>
                        <button onClick={() => setActionType(null)} className="text-[10px] font-black text-rose-600 hover:underline uppercase tracking-widest">Ganti Keputusan</button>
                      </div>

                      <div>
                        <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1.5">Jelaskan Secara Lengkap Kenapa Berkas Ditolak <span className="text-rose-500">*</span></label>
                        <textarea 
                          rows={3}
                          placeholder="Contoh: Dokumen tidak valid karena nomor berkas tidak tercatat pada sistem KKP Loket Palembang..."
                          value={rejectionReason}
                          onChange={(e) => {
                            setRejectionReason(e.target.value);
                            setValidationError("");
                          }}
                          className="w-full bg-white border-2 border-slate-950 rounded-xl p-3 text-xs font-semibold focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Action Buttons */}
              {actionType && (
                <div className="mt-6 pt-4 border-t-2 border-slate-950 flex justify-end gap-3">
                  <button 
                    onClick={cancelProcessing}
                    className="border-2 border-slate-950 hover:bg-slate-50 text-slate-900 font-black uppercase tracking-widest rounded-xl px-4 py-2 text-[10px] transition-colors"
                  >
                    Batal
                  </button>
                  {actionType === "approve" ? (
                    <button 
                      onClick={handleApprove}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest rounded-xl px-5 py-2.5 text-[10px] border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
                    >
                      Konfirmasi Setuju & Tugaskan
                    </button>
                  ) : (
                    <button 
                      onClick={handleReject}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-widest rounded-xl px-5 py-2.5 text-[10px] border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
                    >
                      Konfirmasi Tolak Pengaduan
                    </button>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
}
