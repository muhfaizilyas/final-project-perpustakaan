"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandMark from "./BrandMark";

const groups = {
  umum: [
    { href: "/dashboard", label: "Ringkasan" },
    { href: "/dashboard/buku", label: "Buku" },
    { href: "/dashboard/admin/kategori", label: "Kategori" },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Dashboard Admin" },
    { href: "/dashboard/admin/kategori", label: "Kelola Kategori" },
  ],
  pegawai: [
    { href: "/dashboard/pegawai", label: "Dashboard Pegawai" },
    { href: "/dashboard/buku", label: "Kelola Buku" },
  ],
  mahasiswa: [
    { href: "/dashboard/mahasiswa", label: "Dashboard Mahasiswa" },
    { href: "/dashboard/buku", label: "Katalog Buku" },
  ],
};

function NavSection({ title, items, pathname }) {
  return (
    <div className="space-y-2">
      <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </p>
      <div className="space-y-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center rounded-2xl px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-sky-600 text-white shadow-lg shadow-sky-600/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")}
            >
              <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-sm">
                •
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function AppSidebar({ role = "umum" }) {
  const pathname = usePathname();
  const roleItems = groups[role] ?? groups.umum;

  return (
    <aside className="hidden h-screen w-[290px] shrink-0 border-r border-slate-200 bg-white/95 p-5 backdrop-blur xl:flex xl:flex-col xl:sticky xl:top-0">
      <div className="mb-8">
        <BrandMark />
      </div>

      <div className="space-y-6 overflow-y-auto pr-1">
        <NavSection title="Menu Utama" items={groups.umum} pathname={pathname} />
        <NavSection title="Role Aktif" items={roleItems} pathname={pathname} />
      </div>

      <div className="mt-auto rounded-3xl bg-slate-900 p-4 text-white">
        <p className="text-sm font-semibold">RakBaca Pro</p>
        <p className="mt-1 text-xs leading-5 text-slate-300">
          UI dashboard modern untuk perpustakaan kampus, siap dikembangkan ke backend.
        </p>
      </div>
    </aside>
  );
}
