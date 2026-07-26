import { useState, useMemo } from "react";
import { Search, MapPin, User, Phone, CheckCircle2, AlertCircle, FileText, ArrowRight, UserCheck, Calendar } from "lucide-react";
import { Complaint, StatusPengaduan } from "../types";

interface ComplaintTrackerProps {
  complaints: Complaint[];
}

export default function ComplaintTracker({ complaints }: ComplaintTrackerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Filter complaints based on query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    return complaints.filter((c) => {
      return (
        c.ID_PENGADUAN.toLowerCase().includes(query) ||
        c.NAMA_PELAPOR.toLowerCase().includes(query) ||
        c.HP.includes(query) ||
        c.NO_BERKAS.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, complaints]);

  const handleSelect = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
  };

  // Status Style Resolver
  const getStatusStyle = (status: StatusPengaduan) => {
    switch (status) {
      case StatusPengaduan.MenungguVerifikasi:
        return { text: "text-amber-600 bg-amber-50 border-amber-200", label: "Menunggu Verifikasi" };
      case StatusPengaduan.DiverifikasiManagerLoket:
      case StatusPengaduan.DitugaskanKePetugas:
        return { text: "text-blue-600 bg-blue-50 border-blue-200", label: "Terverifikasi Manager" };
      case StatusPengaduan.DalamPenanganan:
        return { text: "text-indigo-600 bg-indigo-50 border-indigo-200", label: "Dalam Penanganan" };
      case StatusPengaduan.Selesai:
        return { text: "text-emerald-600 bg-emerald-50 border-emerald-200", label: "Selesai" };
      case StatusPengaduan.Ditolak:
        return { text: "text-rose-600 bg-rose-50 border-rose-200", label: "Ditolak / Gugur" };
      default:
        return { text: "text-gray-600 bg-gray-50 border-gray-200", label: "Status Tidak Diketahui" };
    }
  };

  // Get active step index for visual timeline
  const getActiveStepIndex = (status: StatusPengaduan) => {
    if (status === StatusPengaduan.Ditolak) return -1;
    switch (status) {
      case StatusPengaduan.MenungguVerifikasi:
        return 1;
      case StatusPengaduan.DiverifikasiManagerLoket:
      case StatusPengaduan.DitugaskanKePetugas:
        return 2;
      case StatusPengaduan.DalamPenanganan:
        return 3;
      case StatusPengaduan.Selesai:
        return 4;
      default:
        return 1;
    }
  };

  const steps = [
    { title: "Tahap 1", label: "Pelapor mengirim", desc: "Menunggu Verifikasi" },
    { title: "Tahap 2", label: "Manager memverifikasi", desc: "Seksi Penetapan / Loket" },
    { title: "Tahap 3", label: "Tindak Lanjut Petugas", desc: "Dalam Penanganan" },
    { title: "Tahap 4", label: "Penyelesaian Akhir", desc: "Sertifikat Selesai" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      
      {/* Search Sidebar */}
      <div className="bg-white rounded-3xl border-2 border-slate-950 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-5">
        <div>
          <h3 className="font-display text-lg font-black text-slate-900 uppercase tracking-tight">Lacak Laporan</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 leading-tight">Gunakan No. Pengaduan, Nama Pelapor, atau No. Berkas</p>
        </div>

        <div className="relative">
          <input 
            type="text" 
            placeholder="Cari kata kunci pelacakan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-950 rounded-2xl pl-10 pr-4 py-3.5 text-xs font-bold focus:outline-none focus:border-yellow-400 transition-all text-slate-900 placeholder:text-slate-400"
          />
          <Search className="w-4 h-4 text-slate-900 absolute left-3.5 top-4 stroke-[2.5]" />
        </div>

        {/* Results List */}
        <div className="space-y-3 overflow-y-auto max-h-[420px] pr-1">
          {searchQuery.trim() === "" ? (
            <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-40 text-slate-900" />
              Masukkan kata kunci pencarian
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40 text-slate-900" />
              Tidak ada hasil yang cocok
            </div>
          ) : (
            searchResults.map((c) => {
              const style = getStatusStyle(c.STATUS);
              const isActive = selectedComplaint?.ID_PENGADUAN === c.ID_PENGADUAN;
              return (
                <button
                  key={c.ID_PENGADUAN}
                  onClick={() => handleSelect(c)}
                  className={`w-full text-left p-4 rounded-2xl border-2 border-slate-950 transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none
                    ${isActive 
                      ? "bg-yellow-400 text-slate-900" 
                      : "bg-white text-slate-900 hover:bg-slate-50"
                    }
                  `}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-mono text-[10px] font-black tracking-tight">{c.ID_PENGADUAN}</span>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border-2 uppercase tracking-widest shrink-0 border-slate-950 bg-white
                      ${isActive ? 'text-slate-900' : style.text}
                    `}>
                      {style.label}
                    </span>
                  </div>
                  <h4 className="font-black text-xs mt-2 truncate uppercase tracking-tight">{c.NAMA_PELAPOR}</h4>
                  <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest mt-2 opacity-80">
                    <span>{c.JENIS_LAYANAN}</span>
                    <span>{c.TGL_PENGADUAN}</span>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Main Track Detail Panel */}
      <div className="lg:col-span-2 bg-white rounded-3xl border-2 border-slate-950 p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] min-h-[450px] flex flex-col">
        {!selectedComplaint ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 text-slate-400">
            <Search className="w-16 h-16 text-slate-300 mb-4 animate-bounce" />
            <h3 className="font-display text-base font-black text-slate-800 uppercase tracking-tight">Detail Pelacakan Laporan</h3>
            <p className="text-xs max-w-sm mt-2 font-bold leading-normal uppercase tracking-wide">Pilih salah satu nomor pengaduan dari hasil pencarian di sebelah kiri untuk melihat status alur kerja terperinci.</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b-2 border-slate-950 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">ID Laporan:</span>
                  <h3 className="font-mono text-base font-black text-slate-900 bg-slate-100 border border-slate-950 px-2 py-0.5 rounded-lg">{selectedComplaint.ID_PENGADUAN}</h3>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">Tanggal Masuk: {selectedComplaint.TGL_PENGADUAN}</p>
              </div>
              <span className={`text-[10px] font-black px-3.5 py-1 rounded-full border-2 uppercase tracking-widest bg-yellow-400 text-slate-900 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                {selectedComplaint.STATUS}
              </span>
            </div>

            {/* Visual Process Timeline */}
            <div className="bg-slate-50 rounded-2xl p-5 border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5 text-center">Visual Alur Proses Penanganan</h4>
              
              {selectedComplaint.STATUS === StatusPengaduan.Ditolak ? (
                <div className="bg-rose-50 border-2 border-slate-950 rounded-xl p-4 text-center">
                  <AlertCircle className="w-6 h-6 text-rose-600 mx-auto mb-2" />
                  <h5 className="font-black text-xs text-rose-800 uppercase tracking-wide">Pengaduan Ditolak / Gugur</h5>
                  <p className="text-[11px] text-rose-700 mt-1.5 font-bold uppercase">{selectedComplaint.HASIL_PENYELESAIAN || "Tidak memenuhi syarat berkas BPN"}</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 relative">
                  {/* Progress Line */}
                  <div className="absolute top-4 left-[12.5%] right-[12.5%] h-1 bg-slate-200 pointer-events-none">
                    <div 
                      className="h-full bg-slate-900 transition-all duration-500"
                      style={{ 
                        width: `${((getActiveStepIndex(selectedComplaint.STATUS) - 1) / 3) * 100}%` 
                      }}
                    />
                  </div>

                  {steps.map((st, i) => {
                    const stepNum = i + 1;
                    const isActive = getActiveStepIndex(selectedComplaint.STATUS) >= stepNum;
                    const isCurrent = getActiveStepIndex(selectedComplaint.STATUS) === stepNum;

                    return (
                      <div key={i} className="flex flex-col items-center text-center relative z-10">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 font-black text-xs transition-all duration-300
                          ${isActive 
                            ? 'bg-yellow-400 text-slate-900 border-slate-950 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' 
                            : 'bg-white text-slate-400 border-slate-200'
                          } 
                          ${isCurrent ? 'ring-4 ring-yellow-400/30 scale-110' : ''}`}
                        >
                          {isActive && !isCurrent ? <CheckCircle2 className="w-4 h-4 text-slate-900" /> : stepNum}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest mt-2.5 ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{st.title}</span>
                        <span className={`text-[10px] hidden sm:block font-black uppercase tracking-tight mt-1 ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>{st.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Document Modules */}
            <div className="space-y-5">
              
              {/* Seksi 1: Pelapor */}
              <div className="border-2 border-slate-950 bg-white rounded-2xl p-5 space-y-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-1.5 border-b-2 border-slate-100 pb-2.5">
                  <User className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                  <span className="font-black text-xs text-slate-900 uppercase tracking-wider">1. Data Pelapor & Laporan Pengaduan</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nama Pelapor / Pemohon</p>
                    <p className="font-black text-slate-900 text-sm mt-0.5">{selectedComplaint.NAMA_PELAPOR}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No. HP Pelapor</p>
                    <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">{selectedComplaint.HP}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nomor Berkas BPN</p>
                    <p className="font-mono font-black text-slate-900 text-sm mt-0.5">{selectedComplaint.NO_BERKAS}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Petugas Teknis Lapangan</p>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedComplaint.PETUGAS_LAPANGAN || "-"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Klasifikasi Layanan</p>
                    <p className="font-black text-slate-900 bg-yellow-400/20 border border-yellow-400/40 rounded px-2 py-0.5 inline-block text-[10px] mt-1">{selectedComplaint.JENIS_LAYANAN}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kategori Masalah</p>
                    <p className="font-black text-slate-900 bg-rose-400/20 border border-rose-400/40 rounded px-2 py-0.5 inline-block text-[10px] mt-1">{selectedComplaint.KATEGORI}</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-850 border-2 border-slate-950 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Uraian Masalah:</p>
                  <p className="leading-relaxed font-bold whitespace-pre-line">{selectedComplaint.URAIAN}</p>
                </div>
                {selectedComplaint.FOTO_BUKTI && (
                  <div className="pt-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Foto Bukti Terlampir:</p>
                    <img src={selectedComplaint.FOTO_BUKTI} alt="Bukti Pelapor" className="h-32 object-cover rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>

              {/* Seksi 2: Manager Loket */}
              {selectedComplaint.MANAGER_VERIFIKASI && (
                <div className="border-2 border-slate-950 bg-white rounded-2xl p-5 space-y-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-1.5 border-b-2 border-slate-100 pb-2.5">
                    <UserCheck className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                    <span className="font-black text-xs text-slate-900 uppercase tracking-wider">2. Verifikasi Manager Loket</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Manager Verifikasi</p>
                      <p className="font-black text-slate-900 text-sm mt-0.5">{selectedComplaint.MANAGER_VERIFIKASI}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tanggal Verifikasi</p>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedComplaint.TGL_VERIFIKASI}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Petugas Penanggung Jawab Ditunjuk</p>
                      <p className="font-black text-slate-900 text-sm bg-yellow-400 inline-block px-2.5 py-0.5 rounded-lg border border-slate-950 mt-1">{selectedComplaint.PETUGAS_PENANGGUNG_JAWAB || "Belum ditunjuk"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Seksi 3: Petugas Tindak Lanjut */}
              {selectedComplaint.TGL_TINDAKLANJUT && (
                <div className="border-2 border-slate-950 bg-white rounded-2xl p-5 space-y-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-1.5 border-b-2 border-slate-100 pb-2.5">
                    <Calendar className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                    <span className="font-black text-xs text-slate-900 uppercase tracking-wider">3. Penanganan Petugas Penanggung Jawab</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mulai Tanggal Tindak Lanjut</p>
                      <p className="font-bold text-slate-900 mt-0.5">{selectedComplaint.TGL_TINDAKLANJUT}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estimasi Target Selesai</p>
                      <p className="font-black text-slate-900 text-sm mt-0.5">{selectedComplaint.TARGET_SELESAI || "-"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-50 rounded-xl p-4 border-2 border-slate-950 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kendala Lapangan</p>
                      <p className="text-slate-900 mt-1 font-bold">{selectedComplaint.KENDALA || "-"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Analisis Penyebab</p>
                      <p className="text-slate-900 mt-1 font-bold">{selectedComplaint.ANALISIS || "-"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tindakan Diambil</p>
                      <p className="text-slate-900 mt-1 font-bold">{selectedComplaint.TINDAKAN || "-"}</p>
                    </div>
                  </div>
                  {selectedComplaint.BUKTI_TINDAKLANJUT && (
                    <div className="pt-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Foto Bukti Penanganan:</p>
                      <img src={selectedComplaint.BUKTI_TINDAKLANJUT} alt="Bukti Tindak Lanjut" className="h-28 object-cover rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>
              )}

              {/* Seksi 4: Penyelesaian Akhir */}
              {selectedComplaint.STATUS === StatusPengaduan.Selesai && selectedComplaint.TGL_SELESAI && (
                <div className="border-2 border-slate-950 bg-yellow-400/10 rounded-2xl p-5 space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-1.5 border-b-2 border-yellow-400/30 pb-2.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                    <span className="font-black text-xs text-slate-900 uppercase tracking-wider">4. Penyelesaian & Penutupan Pengaduan</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tanggal Penyelesaian Selesai</p>
                      <p className="font-black text-slate-900 text-sm mt-0.5">{selectedComplaint.TGL_SELESAI}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Status Akhir Sistem</p>
                      <p className="font-black text-slate-900 text-sm mt-0.5">Tuntas (Selesai)</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-xs text-slate-900 border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Hasil Penyelesaian:</p>
                    <p className="leading-relaxed font-black">{selectedComplaint.HASIL_PENYELESAIAN}</p>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}
      </div>

    </div>
  );
}
