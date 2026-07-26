export enum JenisLayanan {
  PendaftaranTanah = "Pendaftaran Tanah",
  Pengukuran = "Pengukuran",
  Roya = "Roya",
  HakTanggungan = "Hak Tanggungan",
  PeralihanHak = "Peralihan Hak",
  PemecahanPenggabungan = "Pemecahan/Penggabungan",
  Lainnya = "Lainnya"
}

export enum KategoriPengaduan {
  KeterlambatanProses = "Keterlambatan Proses",
  PetugasTidakHadir = "Petugas Tidak Hadir",
  KesalahanData = "Kesalahan Data",
  PelayananTidakMemuaskan = "Pelayanan Tidak Memuaskan",
  Administrasi = "Administrasi",
  Lainnya = "Lainnya"
}

export enum StatusPengaduan {
  MenungguVerifikasi = "Menunggu Verifikasi",
  DiverifikasiManagerLoket = "Diverifikasi Manager Loket",
  DitugaskanKePetugas = "Ditugaskan ke Petugas",
  DalamPenanganan = "Dalam Penanganan",
  Selesai = "Selesai",
  Ditolak = "Ditolak"
}

export interface Complaint {
  ID_PENGADUAN: string;
  TGL_PENGADUAN: string;
  NAMA_PELAPOR: string;
  HP: string;
  NO_BERKAS: string;
  PETUGAS_LAPANGAN: string;
  JENIS_LAYANAN: JenisLayanan;
  KATEGORI: KategoriPengaduan;
  URAIAN: string;
  FOTO_BUKTI: string; // Base64 or local image URL
  STATUS: StatusPengaduan;
  
  // Manager Verifikasi Fields
  MANAGER_VERIFIKASI: string;
  TGL_VERIFIKASI: string;
  PETUGAS_PENANGGUNG_JAWAB: string;

  // Petugas Tindak Lanjut Fields
  TGL_TINDAKLANJUT: string;
  KENDALA: string;
  ANALISIS: string;
  TINDAKAN: string;
  TARGET_SELESAI: string;
  BUKTI_TINDAKLANJUT: string; // Base64 or local image URL
  CATATAN_PETUGAS?: string;

  // Penyelesaian Fields
  HASIL_PENYELESAIAN: string;
  TGL_SELESAI: string;
  BUKTI_PENYELESAIAN?: string; // Base64 or local image URL
}

export interface Officer {
  ID_PETUGAS: string;
  NAMA_PETUGAS: string;
  JABATAN: string;
  UNIT_KERJA: string;
  EMAIL: string;
  STATUS: "Aktif" | "Cuti" | "Non-Aktif";
}

export interface Manager {
  ID_MANAGER: string;
  NAMA_MANAGER: string;
  EMAIL: string;
  JABATAN: string;
}

export interface ActivityLog {
  TANGGAL: string;
  USER: string;
  AKTIVITAS: string;
  ID_PENGADUAN: string;
  KETERANGAN: string;
}

export type Role = "Masyarakat" | "Manager Loket" | "Petugas" | "Administrator";
