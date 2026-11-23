export const ROLE_LABEL = {
  admin: "Administrator",
  pegawai: "Pegawai Perpustakaan",
  mahasiswa: "Mahasiswa",
};

// Isi panel kiri bagian Dashboard, per role. Menu utama (Beranda, Dashboard,
// Katalog, Pengumuman) ada di header dan tidak diulang di sini.
export const PANEL_DASHBOARD = {
  admin: [
    { href: "/dashboard/admin", label: "Ringkasan", ikon: "chart" },
    { href: "/dashboard/transaksi", label: "Transaksi", ikon: "swap" },
    { href: "/dashboard/buku", label: "Kelola Buku", ikon: "book" },
    { href: "/dashboard/admin/user", label: "Kelola User", ikon: "users" },
    { href: "/dashboard/admin/kategori", label: "Kelola Kategori", ikon: "tag" },
  ],
  pegawai: [
    { href: "/dashboard/pegawai", label: "Ringkasan", ikon: "chart" },
    { href: "/dashboard/transaksi", label: "Transaksi", ikon: "swap" },
    { href: "/dashboard/buku", label: "Kelola Buku", ikon: "book" },
  ],
  mahasiswa: [
    { href: "/dashboard/mahasiswa", label: "Ringkasan", ikon: "chart" },
    { href: "/dashboard/mahasiswa#pinjaman", label: "Pinjaman Saya", ikon: "book" },
    { href: "/dashboard/mahasiswa#riwayat", label: "Riwayat", ikon: "clock" },
  ],
};
