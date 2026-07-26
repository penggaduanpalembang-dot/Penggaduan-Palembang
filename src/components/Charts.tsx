import { useMemo, useState } from "react";
import { Complaint, JenisLayanan, KategoriPengaduan, StatusPengaduan } from "../types";

interface ChartsProps {
  complaints: Complaint[];
}

export default function Charts({ complaints }: ChartsProps) {
  const [activeTooltip, setActiveTooltip] = useState<{ id: string; label: string; value: number } | null>(null);

  // 1. Data per Bulan
  const complaintsByMonth = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
    const counts = Array(12).fill(0);
    
    complaints.forEach((c) => {
      const date = new Date(c.TGL_PENGADUAN);
      if (!isNaN(date.getTime())) {
        const month = date.getMonth();
        counts[month]++;
      }
    });

    return months.map((name, index) => ({
      name,
      count: counts[index],
    })).slice(0, 8); // Showing relevant months up to current July
  }, [complaints]);

  // 2. Data per Jenis Layanan
  const complaintsByService = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(JenisLayanan).forEach((val) => {
      counts[val] = 0;
    });

    complaints.forEach((c) => {
      if (counts[c.JENIS_LAYANAN] !== undefined) {
        counts[c.JENIS_LAYANAN]++;
      } else {
        counts["Lainnya"] = (counts["Lainnya"] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [complaints]);

  // 3. Data per Kategori
  const complaintsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(KategoriPengaduan).forEach((val) => {
      counts[val] = 0;
    });

    complaints.forEach((c) => {
      if (counts[c.KATEGORI] !== undefined) {
        counts[c.KATEGORI]++;
      } else {
        counts["Lainnya"] = (counts["Lainnya"] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [complaints]);

  // 4. Data per Petugas Lapangan
  const complaintsByFieldOfficer = useMemo(() => {
    const counts: Record<string, number> = {};
    complaints.forEach((c) => {
      const name = c.PETUGAS_LAPANGAN || "Tidak Diketahui";
      counts[name] = (counts[name] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [complaints]);

  const maxMonthCount = Math.max(...complaintsByMonth.map((d) => d.count), 1);
  const totalComplaintsCount = complaints.length || 1;

  // Pie chart calculation for Kategori
  const donutData = useMemo(() => {
    let cumulativePercent = 0;
    return complaintsByCategory.map((d) => {
      const percent = (d.count / totalComplaintsCount) * 100;
      const startPercent = cumulativePercent;
      cumulativePercent += percent;
      return {
        ...d,
        percent,
        startPercent,
      };
    });
  }, [complaintsByCategory, totalComplaintsCount]);

  return (
    <div id="section-charts" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 1. Grafik Pengaduan per Bulan */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="font-display text-lg font-black text-slate-900 tracking-tight uppercase">Tren Laporan Masuk</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 mb-6">Distribusi volume laporan pengaduan masuk sepanjang tahun 2026</p>
        </div>
        
        <div className="h-64 flex items-end justify-between gap-3 px-2 relative pt-6 border-b border-slate-200">
          {/* Horizontal Grid lines */}
          <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between pointer-events-none select-none">
            <div className="w-full border-t border-dashed border-slate-200 text-[9px] font-black uppercase tracking-wider text-slate-400 pt-0.5">Maks: {maxMonthCount}</div>
            <div className="w-full border-t border-dashed border-slate-200 text-[9px] font-black uppercase tracking-wider text-slate-400 pt-0.5">{Math.round(maxMonthCount / 2)}</div>
            <div className="w-full text-[9px] font-black uppercase tracking-wider text-slate-400 pb-1">0</div>
          </div>

          {complaintsByMonth.map((d, idx) => {
            const barHeightPercent = (d.count / maxMonthCount) * 100;
            return (
              <div 
                key={idx} 
                className="flex-1 flex flex-col items-center group relative z-10"
                onMouseEnter={() => setActiveTooltip({ id: `month-${idx}`, label: d.name, value: d.count })}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                {/* Tooltip */}
                <div className={`absolute bottom-full mb-2 bg-slate-900 text-yellow-400 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-slate-800`}>
                  {d.count} Laporan
                </div>
                <div 
                  className="w-full max-w-[24px] rounded-t-lg bg-slate-900 group-hover:bg-yellow-400 transition-all duration-300 relative" 
                  style={{ height: `${Math.max(barHeightPercent, 4)}%` }}
                >
                  <div className="absolute inset-0 bg-white/10 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mt-2 font-sans">{d.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Grafik Pengaduan per Jenis Layanan */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <h3 className="font-display text-lg font-black text-slate-900 tracking-tight uppercase">Distribusi Jenis Layanan</h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 mb-6">Persentase pengaduan berdasarkan klasifikasi layanan pertanahan</p>
        
        <div className="space-y-5">
          {complaintsByService.map((d, idx) => {
            const percent = (d.count / totalComplaintsCount) * 100;
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                  <span className="uppercase text-[10px] tracking-wide text-slate-600">{d.name}</span>
                  <span className="text-slate-900 font-mono font-black">{d.count} <span className="text-slate-400 font-normal">({Math.round(percent)}%)</span></span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className="h-full bg-slate-900 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Grafik Pengaduan per Kategori */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="font-display text-lg font-black text-slate-900 tracking-tight uppercase">Kategori Masalah Terbanyak</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 mb-6">Klasifikasi berdasarkan jenis masalah yang dilaporkan pemohon</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Donut chart rendering via SVG */}
          <div className="relative flex justify-center items-center">
            <svg width="160" height="160" viewBox="0 0 42 42" className="transform -rotate-90">
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="5.5" />
              {donutData.map((d, idx) => {
                const colors = ["#0f172a", "#facc15", "#475569", "#94a3b8", "#cbd5e1", "#f43f5e"];
                const color = colors[idx % colors.length];
                const dashArray = `${d.percent} ${100 - d.percent}`;
                const dashOffset = 100 - d.startPercent + 25; // +25 to rotate start to top
                
                if (d.percent === 0) return null;
                return (
                  <circle
                    key={idx}
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke={color}
                    strokeWidth="5.8"
                    strokeDasharray={dashArray}
                    strokeDashoffset={dashOffset}
                    className="transition-all duration-500 hover:stroke-[6.5px] cursor-pointer"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black tracking-tighter text-slate-900 font-display">{complaints.length}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total</span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2.5">
            {donutData.map((d, idx) => {
              const colors = ["#0f172a", "#facc15", "#475569", "#94a3b8", "#cbd5e1", "#f43f5e"];
              const color = colors[idx % colors.length];
              return (
                <div key={idx} className="flex items-center gap-2.5 text-xs">
                  <div className="w-3.5 h-3.5 rounded-full shrink-0 border border-slate-300" style={{ backgroundColor: color }} />
                  <span className="text-slate-600 truncate flex-1 font-bold text-[11px] uppercase tracking-tight">{d.name}</span>
                  <span className="font-mono font-black text-slate-900 shrink-0 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10px]">{d.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Top Petugas Lapangan yang Dilaporkan */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <h3 className="font-display text-lg font-black text-slate-900 tracking-tight uppercase">Petugas Lapangan Terkait</h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 mb-6">Jumlah pengaduan yang melibatkan nama petugas teknis di lapangan</p>
        
        <div className="space-y-5">
          {complaintsByFieldOfficer.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs font-bold uppercase tracking-widest">Tidak ada data petugas lapangan</div>
          ) : (
            complaintsByFieldOfficer.map((d, idx) => {
              const colors = ["bg-slate-900", "bg-yellow-400", "bg-slate-600", "bg-slate-400", "bg-slate-300"];
              const colorClass = colors[idx % colors.length];
              const maxOfficerCount = complaintsByFieldOfficer[0]?.count || 1;
              const percent = (d.count / maxOfficerCount) * 100;
              return (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-xs text-yellow-400 shrink-0 shadow-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                      <span className="text-slate-800 uppercase tracking-tight text-[11px] truncate">{d.name}</span>
                      <span className="text-slate-900 font-mono font-black">{d.count} Laporan</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
