import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

const navigation = {
  umum: [
    { href: "/dashboard", label: "Ringkasan" },
    { href: "/dashboard/buku", label: "Katalog Buku" },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Dashboard Admin" },
    { href: "/dashboard/buku", label: "Manajemen Buku" },
    { href: "/dashboard/admin/kategori", label: "Kategori Buku" },
  ],
  pegawai: [
    { href: "/dashboard/pegawai", label: "Dashboard Pegawai" },
    { href: "/dashboard/buku", label: "Manajemen Buku" },
  ],
  mahasiswa: [
    { href: "/dashboard/mahasiswa", label: "Dashboard Mahasiswa" },
    { href: "/dashboard/buku", label: "Jelajahi Buku" },
  ],
};

export default function AppTopbar({ title, subtitle, actions, role = "umum" }) {
  const roleLabel = {
    umum: "Pengunjung",
    admin: "Administrator",
    pegawai: "Pegawai",
    mahasiswa: "Mahasiswa",
  }[role] ?? "Pengguna";
  const items = navigation[role] ?? navigation.umum;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="flex min-h-20 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <details className="group relative shrink-0 xl:hidden">
            <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-xl border border-slate-200 bg-white text-lg text-slate-700 shadow-sm hover:bg-slate-50">
              <span aria-hidden="true">☰</span>
              <span className="sr-only">Buka menu navigasi</span>
            </summary>
            <nav className="absolute left-0 top-12 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl" aria-label="Navigasi mobile">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-800"
                >
                  {item.label}
                </Link>
              ))}
              {role !== "umum" ? (
                <div className="mt-2 border-t border-slate-100 px-2 pt-2">
                  <LogoutButton />
                </div>
              ) : null}
            </nav>
          </details>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700 sm:text-[11px]">
              RakBaca · Perpustakaan Digital
            </p>
            {title ? (
              <h1 className="mt-1 truncate text-lg font-bold text-slate-900 sm:text-xl">
                {title}
              </h1>
            ) : null}
            {subtitle ? (
              <p className="mt-1 hidden max-w-2xl text-sm text-slate-500 md:block">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {actions ? (
            <div className="flex flex-wrap items-center justify-end gap-2">{actions}</div>
          ) : null}
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2.5 py-2 sm:gap-3 sm:px-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-sm font-bold text-white sm:h-9 sm:w-9">
              R
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">RakBaca</p>
              <p className="text-xs text-slate-500">{roleLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
