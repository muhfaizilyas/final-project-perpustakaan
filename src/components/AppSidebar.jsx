import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import LogoutButton from "@/components/LogoutButton";
import { NAV, ROLE_LABEL } from "@/lib/navigation";

export default function AppSidebar({ user }) {
  const items = NAV[user.role] ?? [];

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-slate-200 bg-white/95 px-5 py-6 backdrop-blur xl:flex">
      <div className="mb-9">
        <BrandMark href="/" />
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
          <p className="truncate text-sm font-semibold">{user.nama_lengkap}</p>
          <p className="mt-1 text-xs leading-5 text-slate-300">{ROLE_LABEL[user.role]}</p>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
