import React, { useState } from "react";
import { Upload, FileText, CheckCircle2, Copy, AlertCircle, Sparkles } from "lucide-react";
import { Complaint, JenisLayanan, KategoriPengaduan, StatusPengaduan } from "../types";

interface ComplaintFormProps {
  onAddComplaint: (complaint: Complaint) => void;
  onAddActivityLog: (activity: string, id: string, detail: string) => void;
}

export default function ComplaintForm({ onAddComplaint, onAddActivityLog }: ComplaintFormProps) {
  const [formData, setFormData] = useState({
    NAMA_PELAPOR: "",
    HP: "",
    NO_BERKAS: "",
    PETUGAS_LAPANGAN: "",
    JENIS_LAYANAN: JenisLayanan.PendaftaranTanah,
    KATEGORI: KategoriPengaduan.KeterlambatanProses,
    URAIAN: "",
    LOKASI: "Sukarami",
    FOTO_BUKTI: ""
  });

  const [isDragOver, setIsDragOver] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // List of beautiful land-related preset images if user wants quick mock uploads
  const presets = [
    { name: "Sertifikat Berkas", url: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500&auto=format&fit=crop&q=60" },
    { name: "Lokasi Bidang", url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&auto=format&fit=crop&q=60" },
    { name: "Loket Kantor", url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=60" }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, FOTO_BUKTI: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, FOTO_BUKTI: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.NAMA_PELAPOR.trim()) newErrors.NAMA_PELAPOR = "Nama Pelapor wajib diisi";
    if (!formData.HP.trim()) {
      newErrors.HP = "Nomor HP wajib diisi";
    } else if (!/^\d{9,15}$/.test(formData.HP.replace(/\D/g, ""))) {
      newErrors.HP = "Nomor HP harus berupa angka 9-15 digit";
    }
    if (!formData.NO_BERKAS.trim()) {
      newErrors.NO_BERKAS = "Nomor Berkas wajib diisi";
    } else if (!/^\d{4}\/\d{4}\/[A-Z]{3}$/.test(formData.NO_BERKAS.trim())) {
      newErrors.NO_BERKAS = "Format berkas harus YYYY/NOMOR/KODE (misal: 2026/5043/PLB)";
    }
    if (!formData.URAIAN.trim()) {
      newErrors.URAIAN = "Uraian pengaduan wajib diisi";
    } else if (formData.URAIAN.trim().length < 15) {
      newErrors.URAIAN = "Uraian pengaduan terlalu singkat (minimal 15 karakter)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Generate automatic Complaint ID
    const todayStr = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const randomSuffix = Math.floor(100 + Math.random() * 900); // 3 digit random
    const newId = `PGD-${todayStr}-${randomSuffix}`;

    const dateToday = new Date().toISOString().split("T")[0];

    const newComplaint: Complaint = {
      ID_PENGADUAN: newId,
      TGL_PENGADUAN: dateToday,
      NAMA_PELAPOR: formData.NAMA_PELAPOR,
      HP: formData.HP,
      NO_BERKAS: formData.NO_BERKAS,
      PETUGAS_LAPANGAN: formData.PETUGAS_LAPANGAN || "Tidak Ada",
      JENIS_LAYANAN: formData.JENIS_LAYANAN,
      KATEGORI: formData.KATEGORI,
      URAIAN: formData.URAIAN,
      FOTO_BUKTI: formData.FOTO_BUKTI || presets[0].url,
      STATUS: StatusPengaduan.MenungguVerifikasi,
      MANAGER_VERIFIKASI: "",
      TGL_VERIFIKASI: "",
      PETUGAS_PENANGGUNG_JAWAB: "",
      TGL_TINDAKLANJUT: "",
      KENDALA: "",
      ANALISIS: "",
      TINDAKAN: "",
      TARGET_SELESAI: "",
      BUKTI_TINDAKLANJUT: "",
      HASIL_PENYELESAIAN: "",
      TGL_SELESAI: ""
    };

    onAddComplaint(newComplaint);
    onAddActivityLog(`${formData.NAMA_PELAPOR} (Masyarakat)`, newId, `Mengirim pengaduan baru terkait ${formData.JENIS_LAYANAN} (${formData.KATEGORI})`);
    
    setSubmitSuccess(newId);
    // Reset form
    setFormData({
      NAMA_PELAPOR: "",
      HP: "",
      NO_BERKAS: "",
      PETUGAS_LAPANGAN: "",
      JENIS_LAYANAN: JenisLayanan.PendaftaranTanah,
      KATEGORI: KategoriPengaduan.KeterlambatanProses,
      URAIAN: "",
      LOKASI: "Sukarami",
      FOTO_BUKTI: ""
    });
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-950 p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6 border-b-2 border-slate-950 pb-5">
        <div className="p-2.5 bg-yellow-400 text-slate-900 rounded-xl border border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display text-xl font-black text-slate-900 tracking-tight uppercase">Form Pengaduan Pelayanan</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">Sampaikan keluhan terkait layanan pertanahan secara detail</p>
        </div>
      </div>

      {submitSuccess && (
        <div className="mb-6 bg-yellow-50 border-2 border-slate-950 rounded-2xl p-5 text-slate-900 flex items-start gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CheckCircle2 className="w-6 h-6 text-slate-950 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="font-black text-sm uppercase tracking-tight">Pengaduan Berhasil Terkirim!</h4>
            <p className="text-xs text-slate-700 mt-1">
              Laporan Anda telah berhasil masuk ke sistem dengan nomor pengaduan berikut. Gunakan nomor ini untuk melacak status laporan Anda.
            </p>
            <div className="mt-3 flex items-center gap-2 bg-white border-2 border-slate-950 rounded-xl p-2.5 max-w-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="font-mono font-black text-xs text-slate-900 select-all truncate">{submitSuccess}</span>
              <button 
                type="button"
                onClick={() => navigator.clipboard.writeText(submitSuccess)}
                className="p-1 hover:bg-yellow-400 text-slate-500 hover:text-slate-900 rounded-lg transition-colors border border-transparent hover:border-slate-950"
                title="Salin Nomor Pengaduan"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <button 
              onClick={() => setSubmitSuccess(null)}
              className="mt-4 text-xs font-black text-slate-900 hover:text-yellow-600 uppercase tracking-widest underline decoration-2"
            >
              Kirim Pengaduan Lainnya &rarr;
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: Nama & HP Pelapor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-1.5">Nama Pelapor <span className="text-rose-500">*</span></label>
            <input 
              type="text" 
              placeholder="Contoh: Hendra Wijaya"
              value={formData.NAMA_PELAPOR}
              onChange={(e) => setFormData(prev => ({ ...prev, NAMA_PELAPOR: e.target.value }))}
              className={`w-full bg-slate-50/50 border-2 ${errors.NAMA_PELAPOR ? 'border-rose-500' : 'border-slate-950'} rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-yellow-400 transition-all`}
            />
            {errors.NAMA_PELAPOR && <p className="text-[11px] text-rose-600 font-black uppercase tracking-wider mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.NAMA_PELAPOR}</p>}
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-1.5">Nomor HP Pelapor <span className="text-rose-500">*</span></label>
            <input 
              type="text" 
              placeholder="Contoh: 081273849111"
              value={formData.HP}
              onChange={(e) => setFormData(prev => ({ ...prev, HP: e.target.value }))}
              className={`w-full bg-slate-50/50 border-2 ${errors.HP ? 'border-rose-500' : 'border-slate-950'} rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-yellow-400 transition-all`}
            />
            {errors.HP && <p className="text-[11px] text-rose-600 font-black uppercase tracking-wider mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.HP}</p>}
          </div>
        </div>

        {/* Row 2: Nomor Berkas & Petugas Lapangan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-black text-slate-900 uppercase tracking-widest">Nomor Berkas Pelayanan <span className="text-rose-500">*</span></label>
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Format: YYYY/XXXX/PLB</span>
            </div>
            <input 
              type="text" 
              placeholder="Contoh: 2026/5043/PLB"
              value={formData.NO_BERKAS}
              onChange={(e) => setFormData(prev => ({ ...prev, NO_BERKAS: e.target.value }))}
              className={`w-full bg-slate-50/50 border-2 ${errors.NO_BERKAS ? 'border-rose-500' : 'border-slate-950'} rounded-2xl px-4 py-3.5 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-yellow-400 transition-all font-mono`}
            />
            {errors.NO_BERKAS && <p className="text-[11px] text-rose-600 font-black uppercase tracking-wider mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.NO_BERKAS}</p>}
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-1.5">Nama Petugas Lapangan (Jika Tahu)</label>
            <input 
              type="text" 
              placeholder="Contoh: Rahmat Hidayat"
              value={formData.PETUGAS_LAPANGAN}
              onChange={(e) => setFormData(prev => ({ ...prev, PETUGAS_LAPANGAN: e.target.value }))}
              className="w-full bg-slate-50/50 border-2 border-slate-950 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-yellow-400 transition-all"
            />
          </div>
        </div>

        {/* Row 3: Jenis Layanan & Kategori */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-1.5">Jenis Layanan Pertanahan</label>
            <select 
              value={formData.JENIS_LAYANAN}
              onChange={(e) => setFormData(prev => ({ ...prev, JENIS_LAYANAN: e.target.value as JenisLayanan }))}
              className="w-full bg-slate-50 border-2 border-slate-950 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-yellow-400 transition-all cursor-pointer"
            >
              {Object.values(JenisLayanan).map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-1.5">Kategori Pengaduan</label>
            <select 
              value={formData.KATEGORI}
              onChange={(e) => setFormData(prev => ({ ...prev, KATEGORI: e.target.value as KategoriPengaduan }))}
              className="w-full bg-slate-50 border-2 border-slate-950 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-yellow-400 transition-all cursor-pointer"
            >
              {Object.values(KategoriPengaduan).map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lokasi Pengaduan & Uraian */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-1.5">Wilayah Lokasi Pengaduan (Kelurahan/Kecamatan)</label>
            <input 
              type="text" 
              placeholder="Contoh: Plaju Darat, Kec. Plaju"
              value={formData.LOKASI}
              onChange={(e) => setFormData(prev => ({ ...prev, LOKASI: e.target.value }))}
              className="w-full bg-slate-50/50 border-2 border-slate-950 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-yellow-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-1.5">Uraian Pengaduan <span className="text-rose-500">*</span></label>
            <textarea 
              rows={4}
              placeholder="Tuliskan secara lengkap rincian keluhan, kronologi, serta kendala yang Anda alami..."
              value={formData.URAIAN}
              onChange={(e) => setFormData(prev => ({ ...prev, URAIAN: e.target.value }))}
              className={`w-full bg-slate-50/50 border-2 ${errors.URAIAN ? 'border-rose-500' : 'border-slate-950'} rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-yellow-400 transition-all resize-none`}
            />
            {errors.URAIAN && <p className="text-[11px] text-rose-600 font-black uppercase tracking-wider mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.URAIAN}</p>}
          </div>
        </div>

        {/* Upload Foto Bukti */}
        <div>
          <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Unggah Foto Bukti Pendukung <span className="text-rose-500">*</span></label>
          
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed ${isDragOver ? "border-yellow-500 bg-yellow-50/25" : "border-slate-950 bg-slate-50/50"} rounded-2xl p-6 transition-all duration-300 text-center flex flex-col items-center justify-center`}
          >
            {formData.FOTO_BUKTI ? (
              <div className="space-y-4">
                <img src={formData.FOTO_BUKTI} alt="Bukti" className="h-32 object-cover rounded-xl mx-auto border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" referrerPolicy="no-referrer" />
                <div className="flex gap-2 justify-center">
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, FOTO_BUKTI: "" }))}
                    className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1.5 rounded-xl border border-rose-300 font-black uppercase tracking-wider transition-colors"
                  >
                    Hapus Foto
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-slate-950 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-slate-900 bg-yellow-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-600 font-bold">
                  <label htmlFor="file-upload" className="font-black text-slate-900 hover:text-yellow-600 cursor-pointer underline transition-colors">Klik untuk unggah</label> atau seret berkas ke sini
                  <p className="text-[10px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">Format gambar JPG, PNG, atau GIF up to 5MB</p>
                </div>
                <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>
            )}
          </div>

          {/* Quick preset selector if user has no files */}
          {!formData.FOTO_BUKTI && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gunakan Contoh Bukti:</span>
              {presets.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, FOTO_BUKTI: preset.url }))}
                  className="text-[11px] font-black uppercase border-2 border-slate-950 bg-white hover:bg-yellow-400 text-slate-900 px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-5 border-t-2 border-slate-950 flex justify-end">
          <button 
            type="submit"
            className="bg-yellow-400 hover:bg-slate-900 hover:text-white text-slate-900 border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none font-black text-xs uppercase tracking-widest py-3.5 px-6 rounded-2xl transition-all cursor-pointer"
          >
            Kirim Pengaduan Sekarang
          </button>
        </div>

      </form>
    </div>
  );
}
