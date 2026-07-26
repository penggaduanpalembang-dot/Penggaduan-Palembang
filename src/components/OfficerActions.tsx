import React, { useState, useMemo } from "react";
import { Wrench, CheckCircle2, Calendar, AlertTriangle, Upload, RefreshCw, X, Eye } from "lucide-react";
import { Complaint, Officer, StatusPengaduan } from "../types";

interface OfficerActionsProps {
  complaints: Complaint[];
  officers: Officer[];
  onUpdateComplaint: (updated: Complaint) => void;
  onAddActivityLog: (activity: string, id: string, detail: string) => void;
  onTriggerNotification: (title: string, body: string, type: "manager" | "officer" | "public") => void;
}

export default function OfficerActions({
  complaints,
  officers,
  onUpdateComplaint,
  onAddActivityLog,
  onTriggerNotification
}: OfficerActionsProps) {
  const [selectedOfficerName, setSelectedOfficerName] = useState(officers[0]?.NAMA_PETUGAS || "");
  const [processingComplaint, setProcessingComplaint] = useState<Complaint | null>(null);
  const [workflowType, setWorkflowType] = useState<"tindak_lanjut" | "selesaikan" | null>(null);

  // Form Fields
  const [tglTindakLanjut, setTglTindakLanjut] = useState(new Date().toISOString().split("T")[0]);
  const [kendala, setKendala] = useState("");
  const [analisis, setAnalisis] = useState("");
  const [tindakan, setTindakan] = useState("");
  const [targetSelesai, setTargetSelesai] = useState("");
  const [catatanPetugas, setCatatanPetugas] = useState("");
  const [buktiTindakLanjut, setBuktiTindakLanjut] = useState("");

  const [hasilPenyelesaian, setHasilPenyelesaian] = useState("");
  const [tglSelesai, setTglSelesai] = useState(new Date().toISOString().split("T")[0]);
  const [buktiPenyelesaian, setBuktiPenyelesaian] = useState("");

  const [formError, setFormError] = useState("");

  const presets = [
    { name: "Peta Koordinat", url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60" },
    { name: "Dokumen TTD", url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500&auto=format&fit=crop&q=60" },
    { name: "Fisik Bidang", url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&auto=format&fit=crop&q=60" }
  ];

  // Assigned complaints for the active simulator officer
  const assignedComplaints = useMemo(() => {
    return complaints.filter(
      (c) => c.PETUGAS_PENANGGUNG_JAWAB === selectedOfficerName && 
             c.STATUS !== StatusPengaduan.Selesai && 
             c.STATUS !== StatusPengaduan.Ditolak
    );
  }, [complaints, selectedOfficerName]);

  const startWorkflow = (complaint: Complaint, type: "tindak_lanjut" | "selesaikan") => {
    setProcessingComplaint(complaint);
    setWorkflowType(type);
    setFormError("");
    
    // Reset inputs
    if (type === "tindak_lanjut") {
      setTglTindakLanjut(new Date().toISOString().split("T")[0]);
      setKendala(complaint.KENDALA || "");
      setAnalisis(complaint.ANALISIS || "");
      setTindakan(complaint.TINDAKAN || "");
      setTargetSelesai(complaint.TARGET_SELESAI || "");
      setCatatanPetugas(complaint.CATATAN_PETUGAS || "");
      setBuktiTindakLanjut(complaint.BUKTI_TINDAKLANJUT || "");
    } else {
      setHasilPenyelesaian(complaint.HASIL_PENYELESAIAN || "");
      setTglSelesai(new Date().toISOString().split("T")[0]);
      setBuktiPenyelesaian(complaint.BUKTI_PENYELESAIAN || "");
    }
  };

  const cancelWorkflow = () => {
    setProcessingComplaint(null);
    setWorkflowType(null);
    setFormError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "tindak_lanjut" | "selesai") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === "tindak_lanjut") {
          setBuktiTindakLanjut(reader.result as string);
        } else {
          setBuktiPenyelesaian(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const submitTindakLanjut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!processingComplaint) return;

    if (!kendala.trim()) {
      setFormError("Kendala lapangan wajib diisi");
      return;
    }
    if (!analisis.trim()) {
      setFormError("Analisis penyebab masalah wajib diisi");
      return;
    }
    if (!tindakan.trim()) {
      setFormError("Tindakan yang dilakukan wajib diisi");
      return;
    }
    if (!targetSelesai) {
      setFormError("Target tanggal penyelesaian wajib diisi");
      return;
    }

    const updated: Complaint = {
      ...processingComplaint,
      STATUS: StatusPengaduan.DalamPenanganan,
      TGL_TINDAKLANJUT: tglTindakLanjut,
      KENDALA: kendala,
      ANALISIS: analisis,
      TINDAKAN: tindakan,
      TARGET_SELESAI: targetSelesai,
      CATATAN_PETUGAS: catatanPetugas,
      BUKTI_TINDAKLANJUT: buktiTindakLanjut || presets[0].url
    };

    onUpdateComplaint(updated);

    onAddActivityLog(
      `${selectedOfficerName} (Petugas PJ)`,
      processingComplaint.ID_PENGADUAN,
      `Mengisi tindak lanjut: ${tindakan}. Target penyelesaian: ${targetSelesai}`
    );

    cancelWorkflow();
  };

  const submitPenyelesaian = (e: React.FormEvent) => {
    e.preventDefault();
    if (!processingComplaint) return;

    if (!hasilPenyelesaian.trim() || hasilPenyelesaian.trim().length < 15) {
      setFormError("Hasil penyelesaian wajib diisi (minimal 15 karakter)");
      return;
    }

    const updated: Complaint = {
      ...processingComplaint,
      STATUS: StatusPengaduan.Selesai,
      HASIL_PENYELESAIAN: hasilPenyelesaian,
      TGL_SELESAI: tglSelesai,
      BUKTI_PENYELESAIAN: buktiPenyelesaian || presets[1].url
    };

    onUpdateComplaint(updated);

    onAddActivityLog(
      `${selectedOfficerName} (Petugas PJ)`,
      processingComplaint.ID_PENGADUAN,
      `Menyelesaikan pengaduan: ${hasilPenyelesaian}`
    );

    // Trigger Notification to Pelapor
    onTriggerNotification(
      "Pengaduan Selesai Ditangani!",
      `Yth. ${processingComplaint.NAMA_PELAPOR}, laporan Anda (${processingComplaint.ID_PENGADUAN}) telah selesai ditangani dengan hasil: ${hasilPenyelesaian}`,
      "public"
    );

    cancelWorkflow();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Simulation Selector Bar */}
      <div className="bg-slate-900 rounded-3xl p-5 text-white border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Simulator Akun Petugas PJ</span>
          <h4 className="text-xs text-slate-300 mt-0.5 font-bold">Pilih nama petugas di bawah untuk melihat pengaduan yang ditugaskan kepada mereka:</h4>
        </div>
        <select 
          value={selectedOfficerName}
          onChange={(e) => {
            setSelectedOfficerName(e.target.value);
            cancelWorkflow();
          }}
          className="bg-slate-800 border-2 border-slate-950 text-white font-bold rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-yellow-400 cursor-pointer w-full sm:w-auto"
        >
          {officers.map((o) => (
            <option key={o.ID_PETUGAS} value={o.NAMA_PETUGAS}>{o.NAMA_PETUGAS} ({o.UNIT_KERJA})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Assigned complaints list */}
        <div className={`${processingComplaint ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-4`}>
          <div className="flex justify-between items-center border-b-2 border-slate-950 pb-2">
            <h3 className="font-display text-xs font-black uppercase tracking-wider text-slate-900">Daftar Pengaduan Ditugaskan</h3>
            <span className="text-[10px] font-black bg-yellow-400 border border-slate-950 px-2 py-0.5 rounded text-slate-950 uppercase tracking-wider">{assignedComplaints.length} Laporan</span>
          </div>

          {assignedComplaints.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-slate-950 p-8 text-center text-slate-500 text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle2 className="w-10 h-10 text-yellow-500 mx-auto mb-2 stroke-[3]" />
              <p className="font-black text-slate-900 uppercase tracking-wider">Tugas Selesai!</p>
              <p className="text-[10px] text-slate-500 mt-1">Tidak ada pengaduan aktif yang ditugaskan ke Anda saat ini.</p>
            </div>
          ) : (
            assignedComplaints.map((c) => {
              const isSelected = processingComplaint?.ID_PENGADUAN === c.ID_PENGADUAN;
              const hasTindakLanjut = !!c.TGL_TINDAKLANJUT;
              return (
                <div 
                  key={c.ID_PENGADUAN}
                  className={`bg-white rounded-3xl border-2 border-slate-950 p-5 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isSelected ? 'ring-2 ring-yellow-400 bg-yellow-400/5' : ''}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-mono text-[9px] font-black text-slate-900 bg-yellow-400 border border-slate-950 px-2 py-0.5 rounded uppercase tracking-wider">{c.ID_PENGADUAN}</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded border border-slate-950 uppercase tracking-widest ${hasTindakLanjut ? 'text-indigo-600 bg-indigo-50' : 'text-amber-600 bg-amber-50'}`}>
                      {hasTindakLanjut ? "PROSES" : "VERIFIKASI"}
                    </span>
                  </div>
                  <h4 className="font-black text-xs text-slate-900 mt-3 uppercase tracking-wider">Pelapor: {c.NAMA_PELAPOR}</h4>
                  <p className="text-[11px] text-slate-600 font-bold mt-1">Layanan: <span className="font-black text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{c.JENIS_LAYANAN}</span></p>
                  <p className="text-[11px] text-slate-600 font-medium line-clamp-2 bg-slate-50 border border-slate-950/10 p-2.5 rounded-xl mt-3 text-justify">{c.URAIAN}</p>
                  
                  {!isSelected && (
                    <div className="mt-4 flex gap-2 justify-end">
                      {!hasTindakLanjut ? (
                        <button 
                          onClick={() => startWorkflow(c, "tindak_lanjut")}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl px-3.5 py-2 text-[10px] uppercase tracking-widest border-2 border-slate-950 transition-colors"
                        >
                          Tindak Lanjut (Tahap 3)
                        </button>
                      ) : (
                        <button 
                          onClick={() => startWorkflow(c, "selesaikan")}
                          className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-black rounded-xl px-3.5 py-2 text-[10px] uppercase tracking-widest border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
                        >
                          Selesaikan (Tahap 4)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right: Processing Panel */}
        {processingComplaint && workflowType && (
          <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-slate-950 p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b-2 border-slate-950 pb-3 mb-5">
                <div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Proses Berkas:</span>
                  <h4 className="font-mono text-sm font-black text-slate-900 bg-yellow-400 border border-slate-950 px-2 py-0.5 rounded-md mt-0.5 inline-block">{processingComplaint.ID_PENGADUAN}</h4>
                </div>
                <button onClick={cancelWorkflow} className="p-1.5 hover:bg-slate-100 text-slate-950 rounded-xl border border-transparent hover:border-slate-950 transition-all cursor-pointer">
                  <X className="w-5 h-5 stroke-[3]" />
                </button>
              </div>

              {/* Error box */}
              {formError && (
                <div className="mb-5 bg-rose-50 border-2 border-rose-600 rounded-2xl p-4 text-rose-700 text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(225,29,72,1)]">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 stroke-[3]" />
                  <span>{formError}</span>
                </div>
              )}

              {/* TAHAP 3 Form: Tindak Lanjut */}
              {workflowType === "tindak_lanjut" && (
                <form onSubmit={submitTindakLanjut} className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5"><Wrench className="w-4 h-4 stroke-[3]" /> Tahap 3 - Rencana Tindak Lanjut</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Mulai Tindak Lanjut</label>
                      <input 
                        type="date"
                        value={tglTindakLanjut}
                        onChange={(e) => setTglTindakLanjut(e.target.value)}
                        className="w-full bg-white border-2 border-slate-950 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Target Selesai <span className="text-rose-500">*</span></label>
                      <input 
                        type="date"
                        value={targetSelesai}
                        onChange={(e) => setTargetSelesai(e.target.value)}
                        className="w-full bg-white border-2 border-slate-950 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Kendala Lapangan <span className="text-rose-500">*</span></label>
                    <textarea 
                      rows={2}
                      placeholder="Jelaskan kendala atau kelengkapan berkas yang menjadi ganjalan..."
                      value={kendala}
                      onChange={(e) => { setKendala(e.target.value); setFormError(""); }}
                      className="w-full bg-white border-2 border-slate-950 rounded-xl p-3 text-xs font-semibold focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Analisis Penyebab <span className="text-rose-500">*</span></label>
                    <textarea 
                      rows={2}
                      placeholder="Apa akar masalah dari keterlambatan atau keluhan ini?"
                      value={analisis}
                      onChange={(e) => { setAnalisis(e.target.value); setFormError(""); }}
                      className="w-full bg-white border-2 border-slate-950 rounded-xl p-3 text-xs font-semibold focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Aksi Nyata Lapangan <span className="text-rose-500">*</span></label>
                    <textarea 
                      rows={2}
                      placeholder="Tuliskan aksi nyata Anda untuk mengatasi ganjalan ini..."
                      value={tindakan}
                      onChange={(e) => { setTindakan(e.target.value); setFormError(""); }}
                      className="w-full bg-white border-2 border-slate-950 rounded-xl p-3 text-xs font-semibold focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Catatan Tambahan Petugas</label>
                    <input 
                      type="text"
                      placeholder="Catatan tambahan (opsional)..."
                      value={catatanPetugas}
                      onChange={(e) => setCatatanPetugas(e.target.value)}
                      className="w-full bg-white border-2 border-slate-950 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                    />
                  </div>

                  {/* Upload Bukti Tindak Lanjut */}
                  <div>
                    <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1.5">Bukti Tindak Lanjut (Foto Lapangan)</label>
                    <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-950 rounded-xl p-3">
                      {buktiTindakLanjut ? (
                        <div className="flex items-center gap-3">
                          <img src={buktiTindakLanjut} alt="Bukti Penanganan" className="w-14 h-14 object-cover rounded-xl border-2 border-slate-950" />
                          <button type="button" onClick={() => setBuktiTindakLanjut("")} className="text-[10px] text-rose-600 font-black uppercase tracking-widest hover:underline">Hapus</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs">
                          <Upload className="w-4 h-4 text-slate-600 stroke-[3]" />
                          <label htmlFor="pj-file-upload" className="font-black text-indigo-600 hover:text-indigo-700 cursor-pointer uppercase tracking-wider text-[10px]">Unggah Foto</label>
                          <input id="pj-file-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, "tindak_lanjut")} className="hidden" />
                        </div>
                      )}
                    </div>
                    {!buktiTindakLanjut && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {presets.map((p, i) => (
                          <button key={i} type="button" onClick={() => setBuktiTindakLanjut(p.url)} className="text-[9px] font-black uppercase tracking-wider bg-white border-2 border-slate-950 px-2.5 py-1 rounded-lg text-slate-950 hover:bg-slate-50 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">{p.name}</button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t-2 border-slate-950 flex justify-end gap-3">
                    <button type="button" onClick={cancelWorkflow} className="border-2 border-slate-950 hover:bg-slate-50 text-slate-900 font-black uppercase tracking-widest rounded-xl px-4 py-2 text-[10px]">Batal</button>
                    <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest rounded-xl px-5 py-2.5 text-[10px] border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">Simpan Rencana</button>
                  </div>
                </form>
              )}

              {/* TAHAP 4 Form: Penyelesaian */}
              {workflowType === "selesaikan" && (
                <form onSubmit={submitPenyelesaian} className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[3]" /> Tahap 4 - Penyelesaian Akhir</h4>
                  
                  <div>
                    <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Tanggal Selesai Penanganan</label>
                    <input 
                      type="date"
                      value={tglSelesai}
                      onChange={(e) => setTglSelesai(e.target.value)}
                      className="w-full bg-white border-2 border-slate-950 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Hasil Penyelesaian (Jelaskan Secara Rinci) <span className="text-rose-500">*</span></label>
                    <textarea 
                      rows={4}
                      placeholder="Jelaskan secara konkret apa hasil penyelesaian dari pengaduan ini (misal: Sertifikat pendaftaran tanah sudah berhasil dicetak, divalidasi dan diserahkan ke pemohon)..."
                      value={hasilPenyelesaian}
                      onChange={(e) => { setHasilPenyelesaian(e.target.value); setFormError(""); }}
                      className="w-full bg-white border-2 border-slate-950 rounded-xl p-3 text-xs font-semibold focus:outline-none resize-none"
                    />
                  </div>

                  {/* Upload Bukti Penyelesaian */}
                  <div>
                    <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1.5">Bukti Penyelesaian Berkas (Foto Serah Terima)</label>
                    <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-950 rounded-xl p-3">
                      {buktiPenyelesaian ? (
                        <div className="flex items-center gap-3">
                          <img src={buktiPenyelesaian} alt="Bukti Penyelesaian" className="w-14 h-14 object-cover rounded-xl border-2 border-slate-950" />
                          <button type="button" onClick={() => setBuktiPenyelesaian("")} className="text-[10px] text-rose-600 font-black uppercase tracking-widest hover:underline">Hapus</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs">
                          <Upload className="w-4 h-4 text-slate-600 stroke-[3]" />
                          <label htmlFor="sol-file-upload" className="font-black text-emerald-600 hover:text-emerald-700 cursor-pointer uppercase tracking-wider text-[10px]">Unggah Foto</label>
                          <input id="sol-file-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, "selesai")} className="hidden" />
                        </div>
                      )}
                    </div>
                    {!buktiPenyelesaian && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {presets.map((p, i) => (
                          <button key={i} type="button" onClick={() => setBuktiPenyelesaian(p.url)} className="text-[9px] font-black uppercase tracking-wider bg-white border-2 border-slate-950 px-2.5 py-1 rounded-lg text-slate-950 hover:bg-slate-50 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">{p.name}</button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t-2 border-slate-950 flex justify-end gap-3">
                    <button type="button" onClick={cancelWorkflow} className="border-2 border-slate-950 hover:bg-slate-50 text-slate-900 font-black uppercase tracking-widest rounded-xl px-4 py-2 text-[10px]">Batal</button>
                    <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-black uppercase tracking-widest rounded-xl px-5 py-2.5 text-[10px] border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">Tandai Selesai (Tuntas)</button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
