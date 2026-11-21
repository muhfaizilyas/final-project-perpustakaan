import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import LogoutButton from "@/components/LogoutButton";

const navigation = {
  umum: [
    { href: "/dashboard", label: "Ringkasan", icon: "▣" },
    { href: "/dashboard/buku", label: "Katalog Buku", icon: "▤" },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Dashboard Admin", icon: "▣" },
    { href: "/dashboard/buku", label: "Manajemen Buku", icon: "▤" },
    { href: "/dashboard/admin/kategori", label: "Kategori Buku", icon: "▦" },
  ],
  pegawai: [
    { href: "/dashboard/pegawai", label: "Dashboard Pegawai", icon: "▣" },
    { href: "/dashboard/buku", label: "Manajemen Buku", icon: "▤" },
  ],
  mahasiswa: [
    { href: "/dashboard/mahasiswa", label: "Dashboard Mahasiswa", icon: "▣" },
    { href: "/dashboard/buku", label: "Jelajahi Buku", icon: "▤" },
  ],
};

export default function AppSidebar({ role = "umum" }) {
  const items = navigation[role] ?? navigation.umum;
  const roleLabel = {
    umum: "Pengunjung",
    admin: "Administrator",
    pegawai: "Pegawai Perpustakaan",
    mahasiswa: "Mahasiswa",
  }[role] ?? "Pengguna";

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-slate-200 bg-white/95 px-5 py-6 backdrop-blur xl:flex">
      <div className="mb-9">
        <BrandMark />
      </div>

      <div>
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Menu Utama
        </p>
        <nav className="space-y-1" aria-label="Navigasi utama">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-700"
            >
              <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-base text-slate-600">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto space-y-4">
        <div className="rounded-3xl bg-slate-900 p-4 text-white">
          <p className="text-sm font-semibold">RakBaca</p>
          <p className="mt-1 text-xs leading-5 text-slate-300">{roleLabel}</p>
        </div>
        {role !== "umum" ? <LogoutButton /> : null}
      </div>
    </aside>
  );
}
