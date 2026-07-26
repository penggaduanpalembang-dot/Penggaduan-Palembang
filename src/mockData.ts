import { 
  Complaint, 
  Officer, 
  Manager, 
  ActivityLog, 
  JenisLayanan, 
  KategoriPengaduan, 
  StatusPengaduan 
} from "./types";

export const INITIAL_OFFICERS: Officer[] = [
  {
    ID_PETUGAS: "PTG-001",
    NAMA_PETUGAS: "Achmad Syarifuddin, S.SiT.",
    JABATAN: "Surveyor Kadaster Pertama",
    UNIT_KERJA: "Seksi Survei dan Pemetaan",
    EMAIL: "achmad.syarifuddin@bpn.go.id",
    STATUS: "Aktif"
  },
  {
    ID_PETUGAS: "PTG-002",
    NAMA_PETUGAS: "Budi Wijaya, A.Ptnh.",
    JABATAN: "Analis Hukum Pertanahan",
    UNIT_KERJA: "Seksi Penetapan Hak dan Pendaftaran",
    EMAIL: "budi.wijaya@bpn.go.id",
    STATUS: "Aktif"
  },
  {
    ID_PETUGAS: "PTG-003",
    NAMA_PETUGAS: "Dian Lestari, S.H.",
    JABATAN: "Pengelola Pelayanan Roya & HT",
    UNIT_KERJA: "Seksi Hubungan Hukum Pertanahan",
    EMAIL: "dian.lestari@bpn.go.id",
    STATUS: "Aktif"
  },
  {
    ID_PETUGAS: "PTG-004",
    NAMA_PETUGAS: "Hendra Saputra, S.T.",
    JABATAN: "Surveyor Pemetaan Pengukuran",
    UNIT_KERJA: "Seksi Survei dan Pemetaan",
    EMAIL: "hendra.saputra@bpn.go.id",
    STATUS: "Aktif"
  },
  {
    ID_PETUGAS: "PTG-005",
    NAMA_PETUGAS: "Rina Kartika, S.H.",
    JABATAN: "Analis Pendaftaran Hak",
    UNIT_KERJA: "Seksi Hubungan Hukum Pertanahan",
    EMAIL: "rina.kartika@bpn.go.id",
    STATUS: "Cuti"
  }
];

export const INITIAL_MANAGERS: Manager[] = [
  {
    ID_MANAGER: "MGR-001",
    NAMA_MANAGER: "Sri Wahyuni, S.H., M.Kn.",
    EMAIL: "sri.wahyuni@bpn.go.id",
    JABATAN: "Kepala Seksi Hubungan Hukum Pertanahan"
  },
  {
    ID_MANAGER: "MGR-002",
    NAMA_MANAGER: "M. Yusuf, S.IP.",
    EMAIL: "m.yusuf@bpn.go.id",
    JABATAN: "Koordinator Loket Pelayanan Utama"
  },
  {
    ID_MANAGER: "MGR-003",
    NAMA_MANAGER: "Ir. H. M. Firdaus, M.Si.",
    EMAIL: "m.firdaus@bpn.go.id",
    JABATAN: "Kepala Seksi Survei dan Pemetaan"
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    ID_PENGADUAN: "PGD-20260701-001",
    TGL_PENGADUAN: "2026-07-01",
    NAMA_PELAPOR: "Hendra Wijaya",
    HP: "081273849111",
    NO_BERKAS: "2026/5043/PLB",
    PETUGAS_LAPANGAN: "Rahmat Hidayat",
    JENIS_LAYANAN: JenisLayanan.PendaftaranTanah,
    KATEGORI: KategoriPengaduan.KeterlambatanProses,
    URAIAN: "Pendaftaran sertifikat tanah warisan di Kelurahan Demang Lebar Daun sudah lebih dari 3 bulan belum selesai, padahal dijanjikan 14 hari kerja.",
    FOTO_BUKTI: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500&auto=format&fit=crop&q=60",
    STATUS: StatusPengaduan.Selesai,
    MANAGER_VERIFIKASI: "M. Yusuf, S.IP.",
    TGL_VERIFIKASI: "2026-07-02",
    PETUGAS_PENANGGUNG_JAWAB: "Budi Wijaya, A.Ptnh.",
    TGL_TINDAKLANJUT: "2026-07-03",
    KENDALA: "Berkas fisik belum diserahkan sepenuhnya oleh pemohon dari kelurahan setempat.",
    ANALISIS: "Terjadi miskomunikasi antara pihak kelurahan dan pemohon mengenai tanda tangan surat kuasa ahli waris.",
    TINDAKAN: "Menghubungi pemohon dan membantu mediasi kelengkapan tanda tangan kelurahan.",
    TARGET_SELESAI: "2026-07-05",
    BUKTI_TINDAKLANJUT: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500&auto=format&fit=crop&q=60",
    HASIL_PENYELESAIAN: "Sertifikat pendaftaran tanah selesai dicetak dan diserahkan kepada Pak Hendra Wijaya pada tanggal 5 Juli 2026.",
    TGL_SELESAI: "2026-07-05"
  },
  {
    ID_PENGADUAN: "PGD-20260705-002",
    TGL_PENGADUAN: "2026-07-05",
    NAMA_PELAPOR: "Siti Fatimah",
    HP: "085264778123",
    NO_BERKAS: "2026/9822/PLB",
    PETUGAS_LAPANGAN: "Aditya Pratama",
    JENIS_LAYANAN: JenisLayanan.Pengukuran,
    KATEGORI: KategoriPengaduan.PetugasTidakHadir,
    URAIAN: "Petugas pengukuran lapangan tidak hadir pada jadwal yang telah disepakati di Plaju Darat, tanpa memberikan informasi lanjutan.",
    FOTO_BUKTI: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&auto=format&fit=crop&q=60",
    STATUS: StatusPengaduan.DalamPenanganan,
    MANAGER_VERIFIKASI: "Ir. H. M. Firdaus, M.Si.",
    TGL_VERIFIKASI: "2026-07-06",
    PETUGAS_PENANGGUNG_JAWAB: "Achmad Syarifuddin, S.SiT.",
    TGL_TINDAKLANJUT: "2026-07-07",
    KENDALA: "Petugas lapangan sebelumnya (Aditya) mengalami sakit mendadak dan tidak sempat melakukan koordinasi serah terima jadwal harian.",
    ANALISIS: "Kurangnya redundansi koordinasi tim lapangan jika ada petugas yang berhalangan hadir secara mendadak.",
    TINDAKAN: "Jadwal pengukuran diatur ulang dan ditangani langsung oleh Achmad Syarifuddin.",
    TARGET_SELESAI: "2026-07-16",
    BUKTI_TINDAKLANJUT: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60",
    HASIL_PENYELESAIAN: "",
    TGL_SELESAI: ""
  },
  {
    ID_PENGADUAN: "PGD-20260710-003",
    TGL_PENGADUAN: "2026-07-10",
    NAMA_PELAPOR: "Andi Saputra",
    HP: "081922883344",
    NO_BERKAS: "2026/1105/PLB",
    PETUGAS_LAPANGAN: "Ferry Irawan",
    JENIS_LAYANAN: JenisLayanan.Roya,
    KATEGORI: KategoriPengaduan.KesalahanData,
    URAIAN: "Pencoretan Hak Tanggungan (Roya) salah ketik nomor sertifikat hak milik. Seharusnya SHM No. 435 tetapi tertulis SHM No. 453.",
    FOTO_BUKTI: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&auto=format&fit=crop&q=60",
    STATUS: StatusPengaduan.DiverifikasiManagerLoket,
    MANAGER_VERIFIKASI: "Sri Wahyuni, S.H., M.Kn.",
    TGL_VERIFIKASI: "2026-07-11",
    PETUGAS_PENANGGUNG_JAWAB: "Dian Lestari, S.H.",
    TGL_TINDAKLANJUT: "",
    KENDALA: "",
    ANALISIS: "",
    TINDAKAN: "",
    TARGET_SELESAI: "",
    BUKTI_TINDAKLANJUT: "",
    HASIL_PENYELESAIAN: "",
    TGL_SELESAI: ""
  },
  {
    ID_PENGADUAN: "PGD-20260712-004",
    TGL_PENGADUAN: "2026-07-12",
    NAMA_PELAPOR: "Mgs. M. Ridwan",
    HP: "082188990011",
    NO_BERKAS: "2026/6740/PLB",
    PETUGAS_LAPANGAN: "Syamsul Bahri",
    JENIS_LAYANAN: JenisLayanan.PeralihanHak,
    KATEGORI: KategoriPengaduan.PelayananTidakMemuaskan,
    URAIAN: "Berkas peralihan hak (jual beli) bolak-balik ditolak di loket tanpa penjelasan yang jelas dan ramah mengenai dokumen mana yang kurang.",
    FOTO_BUKTI: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=60",
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
  },
  {
    ID_PENGADUAN: "PGD-20260713-005",
    TGL_PENGADUAN: "2026-07-13",
    NAMA_PELAPOR: "Dewi Lestari",
    HP: "081373554499",
    NO_BERKAS: "2026/4123/PLB",
    PETUGAS_LAPANGAN: "Rahmat Hidayat",
    JENIS_LAYANAN: JenisLayanan.HakTanggungan,
    KATEGORI: KategoriPengaduan.KeterlambatanProses,
    URAIAN: "Proses Hak Tanggungan elektronik (HT-el) Mandiri sudah 10 hari belum terbit sertifikat HT nya, padahal sistem HT-el biasanya otomatis.",
    FOTO_BUKTI: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=60",
    STATUS: StatusPengaduan.Ditolak,
    MANAGER_VERIFIKASI: "M. Yusuf, S.IP.",
    TGL_VERIFIKASI: "2026-07-14",
    PETUGAS_PENANGGUNG_JAWAB: "",
    TGL_TINDAKLANJUT: "",
    KENDALA: "",
    ANALISIS: "",
    TINDAKAN: "",
    TARGET_SELESAI: "",
    BUKTI_TINDAKLANJUT: "",
    HASIL_PENYELESAIAN: "Pengaduan ditolak karena setelah dicek pada sistem HT-el, berkas masih tertahan di verifikasi internal Pejabat Pembuat Akta Tanah (PPAT) pembuat akta, bukan kendala internal BPN. Pemohon telah disarankan berkoordinasi dengan PPAT ybs.",
    TGL_SELESAI: "2026-07-14"
  },
  {
    ID_PENGADUAN: "PGD-20260714-006",
    TGL_PENGADUAN: "2026-07-14",
    NAMA_PELAPOR: "Agus Salim",
    HP: "08117890554",
    NO_BERKAS: "2026/3312/PLB",
    PETUGAS_LAPANGAN: "Hendra Saputra, S.T.",
    JENIS_LAYANAN: JenisLayanan.PemecahanPenggabungan,
    KATEGORI: KategoriPengaduan.Administrasi,
    URAIAN: "Biaya administrasi PNBP pemecahan sertifikat di loket dinilai tidak transparan, mohon rincian PNBP resmi dari BPN Palembang.",
    FOTO_BUKTI: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=500&auto=format&fit=crop&q=60",
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
  },
  {
    ID_PENGADUAN: "PGD-20260620-007",
    TGL_PENGADUAN: "2026-06-20",
    NAMA_PELAPOR: "Joko Susilo",
    HP: "081273349911",
    NO_BERKAS: "2026/2204/PLB",
    PETUGAS_LAPANGAN: "Aditya Pratama",
    JENIS_LAYANAN: JenisLayanan.PendaftaranTanah,
    KATEGORI: KategoriPengaduan.KeterlambatanProses,
    URAIAN: "Pengurusan sertifikat pendaftaran tanah pertama kali (PTSL) tahun 2025 di Kecamatan Sematang Borang belum diserahkan sampai sekarang.",
    FOTO_BUKTI: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500&auto=format&fit=crop&q=60",
    STATUS: StatusPengaduan.Selesai,
    MANAGER_VERIFIKASI: "M. Yusuf, S.IP.",
    TGL_VERIFIKASI: "2026-06-22",
    PETUGAS_PENANGGUNG_JAWAB: "Achmad Syarifuddin, S.SiT.",
    TGL_TINDAKLANJUT: "2026-06-23",
    KENDALA: "Berkas terselip di gudang arsip lama BPN.",
    ANALISIS: "Arsip fisik PTSL 2025 belum sepenuhnya terdigitalisasi di database KKP.",
    TINDAKAN: "Pencarian manual di gudang arsip dan pemindaian ulang dokumen pendukung.",
    TARGET_SELESAI: "2026-06-28",
    BUKTI_TINDAKLANJUT: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500&auto=format&fit=crop&q=60",
    HASIL_PENYELESAIAN: "Sertifikat berhasil ditemukan, divalidasi, dan diserahterimakan langsung ke Kelurahan Sematang Borang untuk didistribusikan ke Pak Joko Susilo.",
    TGL_SELESAI: "2026-06-27"
  },
  {
    ID_PENGADUAN: "PGD-20260625-008",
    TGL_PENGADUAN: "2026-06-25",
    NAMA_PELAPOR: "Mega Utami",
    HP: "082377443311",
    NO_BERKAS: "2026/7781/PLB",
    PETUGAS_LAPANGAN: "Syamsul Bahri",
    JENIS_LAYANAN: JenisLayanan.PeralihanHak,
    KATEGORI: KategoriPengaduan.KesalahanData,
    URAIAN: "Nama pembeli pada sertifikat baru tertulis 'Mega Utama', padahal di KTP dan Akta Jual Beli (AJB) tertulis jelas 'Mega Utami'. Mohon perbaikan.",
    FOTO_BUKTI: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&auto=format&fit=crop&q=60",
    STATUS: StatusPengaduan.Selesai,
    MANAGER_VERIFIKASI: "Sri Wahyuni, S.H., M.Kn.",
    TGL_VERIFIKASI: "2026-06-26",
    PETUGAS_PENANGGUNG_JAWAB: "Rina Kartika, S.H.",
    TGL_TINDAKLANJUT: "2026-06-27",
    KENDALA: "Salah ketik huruf di lembar isian buku tanah KKP.",
    ANALISIS: "Human error saat inputting data di loket pemeliharaan.",
    TINDAKAN: "Melakukan ralat sertifikat (renovasi data nama) sesuai KTP pemohon.",
    TARGET_SELESAI: "2026-06-29",
    BUKTI_TINDAKLANJUT: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500&auto=format&fit=crop&q=60",
    HASIL_PENYELESAIAN: "Ralat nama pada sertifikat dan buku tanah telah selesai dilakukan dan diparaf sah oleh Kepala Kantor. Pemohon sudah mengambil sertifikat yang diperbaiki.",
    TGL_SELESAI: "2026-06-29"
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    TANGGAL: "2026-07-01 10:15:22",
    USER: "Hendra Wijaya (Masyarakat)",
    AKTIVITAS: "Mengirim Pengaduan Baru",
    ID_PENGADUAN: "PGD-20260701-001",
    KETERANGAN: "Membuat pengaduan pendaftaran tanah terlambat proses di Demang Lebar Daun"
  },
  {
    TANGGAL: "2026-07-02 08:30:11",
    USER: "M. Yusuf, S.IP. (Manager)",
    AKTIVITAS: "Verifikasi & Penugasan Pengaduan",
    ID_PENGADUAN: "PGD-20260701-001",
    KETERANGAN: "Menyetujui pengaduan dan menunjuk Budi Wijaya, A.Ptnh. sebagai petugas PJ"
  },
  {
    TANGGAL: "2026-07-03 14:20:05",
    USER: "Budi Wijaya, A.Ptnh. (Petugas)",
    AKTIVITAS: "Pengisian Tindak Lanjut",
    ID_PENGADUAN: "PGD-20260701-001",
    KETERANGAN: "Mengisi kendala berkas kurang, menghubungi pemohon dan menjadwalkan target 5 Juli"
  },
  {
    TANGGAL: "2026-07-05 16:45:30",
    USER: "Budi Wijaya, A.Ptnh. (Petugas)",
    AKTIVITAS: "Penyelesaian Pengaduan",
    ID_PENGADUAN: "PGD-20260701-001",
    KETERANGAN: "Menyelesaikan pengaduan, menyerahkan sertifikat ke pemohon"
  },
  {
    TANGGAL: "2026-07-05 11:22:15",
    USER: "Siti Fatimah (Masyarakat)",
    AKTIVITAS: "Mengirim Pengaduan Baru",
    ID_PENGADUAN: "PGD-20260705-002",
    KETERANGAN: "Membuat pengaduan petugas pengukuran tidak hadir di Plaju Darat"
  },
  {
    TANGGAL: "2026-07-06 09:05:44",
    USER: "Ir. H. M. Firdaus, M.Si. (Manager)",
    AKTIVITAS: "Verifikasi & Penugasan Pengaduan",
    ID_PENGADUAN: "PGD-20260705-002",
    KETERANGAN: "Menyetujui pengaduan dan menunjuk Achmad Syarifuddin, S.SiT. sebagai petugas PJ"
  },
  {
    TANGGAL: "2026-07-07 10:40:00",
    USER: "Achmad Syarifuddin, S.SiT. (Petugas)",
    AKTIVITAS: "Pengisian Tindak Lanjut",
    ID_PENGADUAN: "PGD-20260705-002",
    KETERANGAN: "Menjadwalkan ulang pengukuran harian langsung ditangani sendiri"
  },
  {
    TANGGAL: "2026-07-10 15:30:12",
    USER: "Andi Saputra (Masyarakat)",
    AKTIVITAS: "Mengirim Pengaduan Baru",
    ID_PENGADUAN: "PGD-20260710-003",
    KETERANGAN: "Membuat pengaduan Roya salah cetak nomor sertifikat"
  },
  {
    TANGGAL: "2026-07-11 11:15:00",
    USER: "Sri Wahyuni, S.H., M.Kn. (Manager)",
    AKTIVITAS: "Verifikasi & Penugasan Pengaduan",
    ID_PENGADUAN: "PGD-20260710-003",
    KETERANGAN: "Menyetujui pengaduan dan menunjuk Dian Lestari, S.H. sebagai petugas PJ"
  },
  {
    TANGGAL: "2026-07-12 16:22:01",
    USER: "Mgs. M. Ridwan (Masyarakat)",
    AKTIVITAS: "Mengirim Pengaduan Baru",
    ID_PENGADUAN: "PGD-20260712-004",
    KETERANGAN: "Membuat pengaduan pelayanan tidak memuaskan loket peralihan hak"
  },
  {
    TANGGAL: "2026-07-13 14:02:55",
    USER: "Dewi Lestari (Masyarakat)",
    AKTIVITAS: "Mengirim Pengaduan Baru",
    ID_PENGADUAN: "PGD-20260713-005",
    KETERANGAN: "Membuat pengaduan sertifikat HT-el lambat terbit"
  },
  {
    TANGGAL: "2026-07-14 10:10:30",
    USER: "M. Yusuf, S.IP. (Manager)",
    AKTIVITAS: "Penolakan Pengaduan",
    ID_PENGADUAN: "PGD-20260713-005",
    KETERANGAN: "Menolak pengaduan karena masalah terletak di PPAT pemohon, bukan internal BPN"
  },
  {
    TANGGAL: "2026-07-14 11:45:00",
    USER: "Agus Salim (Masyarakat)",
    AKTIVITAS: "Mengirim Pengaduan Baru",
    ID_PENGADUAN: "PGD-20260714-006",
    KETERANGAN: "Membuat pengaduan administrasi biaya PNBP pemecahan"
  }
];

export function getStoredData() {
  const complaintsStr = localStorage.getItem("DATA_PENGADUAN");
  const officersStr = localStorage.getItem("MASTER_PETUGAS");
  const managersStr = localStorage.getItem("MASTER_MANAGER");
  const logsStr = localStorage.getItem("LOG_AKTIVITAS");

  const complaints: Complaint[] = complaintsStr ? JSON.parse(complaintsStr) : INITIAL_COMPLAINTS;
  const officers: Officer[] = officersStr ? JSON.parse(officersStr) : INITIAL_OFFICERS;
  const managers: Manager[] = managersStr ? JSON.parse(managersStr) : INITIAL_MANAGERS;
  const logs: ActivityLog[] = logsStr ? JSON.parse(logsStr) : INITIAL_LOGS;

  if (!complaintsStr) localStorage.setItem("DATA_PENGADUAN", JSON.stringify(INITIAL_COMPLAINTS));
  if (!officersStr) localStorage.setItem("MASTER_PETUGAS", JSON.stringify(INITIAL_OFFICERS));
  if (!managersStr) localStorage.setItem("MASTER_MANAGER", JSON.stringify(INITIAL_MANAGERS));
  if (!logsStr) localStorage.setItem("LOG_AKTIVITAS", JSON.stringify(INITIAL_LOGS));

  return { complaints, officers, managers, logs };
}

export function saveStoredData(data: {
  complaints?: Complaint[];
  officers?: Officer[];
  managers?: Manager[];
  logs?: ActivityLog[];
}) {
  if (data.complaints) localStorage.setItem("DATA_PENGADUAN", JSON.stringify(data.complaints));
  if (data.officers) localStorage.setItem("MASTER_PETUGAS", JSON.stringify(data.officers));
  if (data.managers) localStorage.setItem("MASTER_MANAGER", JSON.stringify(data.managers));
  if (data.logs) localStorage.setItem("LOG_AKTIVITAS", JSON.stringify(data.logs));
}
