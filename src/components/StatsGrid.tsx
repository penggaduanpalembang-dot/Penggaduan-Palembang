import { useMemo } from "react";
import { 
  FileText, 
  Clock, 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ShieldAlert,
  UserCheck
} from "lucide-react";
import { Complaint, StatusPengaduan } from "../types";

interface StatsGridProps {
  complaints: Complaint[];
}

export default function StatsGrid({ complaints }: StatsGridProps) {
  // Compute key stats
  const stats = useMemo(() => {
    let total = complaints.length;
    let waiting = 0;
    let pending = 0; // "Diverifikasi", "Ditugaskan", "Dalam Penanganan"
    let completed = 0;
    let rejected = 0;

    complaints.forEach((c) => {
      switch (c.STATUS) {
        case StatusPengaduan.MenungguVerifikasi:
          waiting++;
          break;
        case StatusPengaduan.DiverifikasiManagerLoket:
        case StatusPengaduan.DitugaskanKePetugas:
        case StatusPengaduan.DalamPenanganan:
          pending++;
          break;
        case StatusPengaduan.Selesai:
          completed++;
          break;
        case StatusPengaduan.Ditolak:
          rejected++;
          break;
      }
    });

    return { total, waiting, pending, completed, rejected };
  }, [complaints]);

  // SLA Indicators
  const slaStats = useMemo(() => {
    let finishedWithin3Days = 0;
    let finishedWithin7Days = 0;
    let finishedMoreThan7Days = 0;
    let overdue = 0;

    const today = new Date();

    complaints.forEach((c) => {
      if (c.STATUS === StatusPengaduan.Selesai && c.TGL_SELESAI) {
        const start = new Date(c.TGL_PENGADUAN);
        const end = new Date(c.TGL_SELESAI);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 3) {
          finishedWithin3Days++;
        } else if (diffDays <= 7) {
          finishedWithin7Days++;
        } else {
          finishedMoreThan7Days++;
        }
      } else if (c.STATUS !== StatusPengaduan.Selesai && c.STATUS !== StatusPengaduan.Ditolak) {
        // Active complaint
        const start = new Date(c.TGL_PENGADUAN);
        const diffTime = Math.abs(today.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Overdue if not completed and exceeds 7 days, or past target completion date
        if (diffDays > 7 || (c.TARGET_SELESAI && new Date(c.TARGET_SELESAI) < today)) {
          overdue++;
        }
      }
    });

    const totalResolved = finishedWithin3Days + finishedWithin7Days + finishedMoreThan7Days;
    const resolvedPercent = totalResolved ? Math.round((finishedWithin3Days + finishedWithin7Days) / totalResolved * 100) : 0;

    return {
      finishedWithin3Days,
      finishedWithin7Days,
      finishedMoreThan7Days,
      overdue,
      resolvedPercent
    };
  }, [complaints]);

  // Manager stats
  const managerStats = useMemo(() => {
    let unverified = 0;
    let verified = 0;
    let totalVerifDays = 0;
    let verifCount = 0;

    complaints.forEach((c) => {
      if (c.STATUS === StatusPengaduan.MenungguVerifikasi) {
        unverified++;
      } else {
        verified++;
        if (c.TGL_VERIFIKASI) {
          const start = new Date(c.TGL_PENGADUAN);
          const verif = new Date(c.TGL_VERIFIKASI);
          const diffTime = Math.abs(verif.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
          totalVerifDays += diffDays;
          verifCount++;
        }
      }
    });

    const avgVerifTime = verifCount ? (totalVerifDays / verifCount).toFixed(1) : "1.2";

    return {
      unverified,
      verified,
      avgVerifTime
    };
  }, [complaints]);

  return (
    <div className="space-y-8">
      {/* 1. Ringkasan Utama */}
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 font-sans px-1">Ringkasan Utama Pengaduan</h4>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          
          {/* Total Laporan */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900">
                <FileText className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">Realtime</span>
            </div>
            <p className="text-5xl font-black tracking-tighter text-slate-900 font-display">{stats.total}</p>
            <h3 className="text-xs font-black uppercase tracking-tight text-slate-400 mt-2">Total Pengaduan</h3>
          </div>

          {/* Menunggu Verifikasi - High-contrast Yellow Accent Card from Theme */}
          <div className="bg-yellow-400 rounded-3xl p-6 shadow-lg shadow-yellow-400/20 hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-slate-900 text-yellow-400">
                <Clock className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-900/60 bg-slate-900/10 px-2.5 py-1 rounded-full">Butuh Verif</span>
            </div>
            <div>
              <p className="text-5xl font-black tracking-tighter text-slate-900 font-display">{stats.waiting}</p>
              <h3 className="text-xs font-black uppercase tracking-tight text-slate-900/70 mt-2">Menunggu Verifikasi</h3>
            </div>
          </div>

          {/* Dalam Penanganan */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">Proses</span>
            </div>
            <p className="text-5xl font-black tracking-tighter text-slate-900 font-display">{stats.pending}</p>
            <h3 className="text-xs font-black uppercase tracking-tight text-slate-400 mt-2">Dalam Penanganan</h3>
          </div>

          {/* Selesai */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                <CheckCircle className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">Tuntas</span>
            </div>
            <p className="text-5xl font-black tracking-tighter text-slate-900 font-display">{stats.completed}</p>
            <h3 className="text-xs font-black uppercase tracking-tight text-slate-400 mt-2">Telah Selesai</h3>
          </div>

          {/* Ditolak */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 col-span-2 lg:col-span-1 shadow-sm hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600">
                <XCircle className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">Gugur</span>
            </div>
            <p className="text-5xl font-black tracking-tighter text-slate-900 font-display">{stats.rejected}</p>
            <h3 className="text-xs font-black uppercase tracking-tight text-slate-400 mt-2">Ditolak / Gugur</h3>
          </div>

        </div>
      </div>

      {/* 2. Indikator Kinerja Manager & SLA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Dashboard Manager */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-10">
            <ShieldAlert className="w-48 h-48 text-yellow-400" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-sans">Panel Kinerja Manager Loket</h4>
              <span className="text-[9px] font-black uppercase bg-yellow-400 text-slate-900 px-2.5 py-1 rounded-full">SLA Kontrol</span>
            </div>
            
            <div className="grid grid-cols-3 gap-6 py-2">
              <div className="border-r border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Belum Verif</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-black tracking-tighter text-yellow-400 font-display">{managerStats.unverified}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">berkas</span>
                </div>
              </div>
              
              <div className="border-r border-slate-800 pl-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Telah Verif</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-black tracking-tighter text-emerald-400 font-display">{managerStats.verified}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">berkas</span>
                </div>
              </div>

              <div className="pl-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Rata-rata Verif</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-black tracking-tighter text-blue-300 font-display">{managerStats.avgVerifTime}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">hari</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="font-bold text-slate-300 uppercase tracking-tight text-[11px]">Petugas Manager Standby</span>
              </div>
              <span className="text-yellow-400 font-black uppercase text-[10px] tracking-widest bg-yellow-400/10 px-2.5 py-1 rounded-full">Aktif</span>
            </div>
          </div>
        </div>

        {/* Dashboard SLA Indicators */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-sans">Kepatuhan SLA (Service Level Agreement)</h4>
              <span className="text-[10px] font-black text-slate-900 bg-yellow-400 px-3 py-1 rounded-full uppercase tracking-wider">Target: ≤ 3 Hari</span>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center mb-6">
              
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <p className="text-2xl font-black tracking-tighter text-slate-900 font-display">{slaStats.finishedWithin3Days}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-1">≤ 3 Hari</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <p className="text-2xl font-black tracking-tighter text-slate-900 font-display">{slaStats.finishedWithin7Days}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-1">≤ 7 Hari</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <p className="text-2xl font-black tracking-tighter text-slate-900 font-display">{slaStats.finishedMoreThan7Days}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-1">&gt; 7 Hari</p>
              </div>

              <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200">
                <div className="flex items-center justify-center gap-1">
                  <p className="text-2xl font-black tracking-tighter text-rose-600 font-display">{slaStats.overdue}</p>
                  {slaStats.overdue > 0 && <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 animate-bounce" />}
                </div>
                <p className="text-[9px] font-black text-rose-600 uppercase tracking-wider mt-1">Overdue</p>
              </div>

            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span className="uppercase text-[10px] tracking-widest text-slate-400">Rasio Kepatuhan SLA (≤ 7 Hari)</span>
              <span className="font-black text-slate-900 font-mono">{slaStats.resolvedPercent}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-slate-900 rounded-full transition-all duration-500" 
                style={{ width: `${slaStats.resolvedPercent}%` }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
