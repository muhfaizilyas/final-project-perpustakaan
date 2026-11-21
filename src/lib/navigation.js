// Menu navigasi per role. Dipakai oleh sidebar (desktop) dan topbar (mobile).
export const NAV = {
  admin: [
    { href: "/dashboard/admin", label: "Dashboard Admin", icon: "▣" },
    { href: "/dashboard/buku", label: "Manajemen Buku", icon: "▤" },
    { href: "/dashboard/admin/user", label: "Manajemen User", icon: "☰" },
    { href: "/dashboard/admin/kategori", label: "Kategori Buku", icon: "▦" },
    { href: "/dashboard/transaksi", label: "Transaksi", icon: "⇄" },
    { href: "/dashboard/pengumuman", label: "Pengumuman", icon: "◪" },
    { href: "/katalog", label: "Katalog Buku", icon: "◫" },
  ],
  pegawai: [
    { href: "/dashboard/pegawai", label: "Dashboard Pegawai", icon: "▣" },
    { href: "/dashboard/buku", label: "Manajemen Buku", icon: "▤" },
    { href: "/dashboard/transaksi", label: "Transaksi", icon: "⇄" },
    { href: "/dashboard/pengumuman", label: "Pengumuman", icon: "◪" },
    { href: "/katalog", label: "Katalog Buku", icon: "◫" },
  ],
  mahasiswa: [
    { href: "/dashboard/mahasiswa", label: "Dashboard Mahasiswa", icon: "▣" },
    { href: "/katalog", label: "Katalog Buku", icon: "◫" },
  ],
};

export const ROLE_LABEL = {
  admin: "Administrator",
  pegawai: "Pegawai Perpustakaan",
  mahasiswa: "Mahasiswa",
};
