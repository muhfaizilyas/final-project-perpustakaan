import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { NAV, ROLE_LABEL } from "@/lib/navigation";

export default function AppTopbar({ user, title, subtitle, actions }) {
  const items = NAV[user.role] ?? [];
  const inisial = user.nama_lengkap.trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      {/* Mobile: judul di baris pertama, aksi di baris kedua. Desktop: satu baris. */}
      <div className="grid gap-3 px-4 py-3 sm:flex sm:min-h-20 sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
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
              <div className="mt-2 border-t border-slate-100 px-2 pt-2">
                <LogoutButton />
              </div>
            </nav>
          </details>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700 sm:text-[11px]">
              RakBaca · Perpustakaan Digital
            </p>
            {title ? (
              <h1 className="mt-1 text-lg font-bold text-slate-900 sm:truncate sm:text-xl">{title}</h1>
            ) : null}
            {subtitle ? (
              <p className="mt-1 hidden max-w-2xl text-sm text-slate-500 md:block">{subtitle}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end sm:gap-3">
          {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
          <div className="ml-auto flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2.5 py-2 sm:ml-0 sm:gap-3 sm:px-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-sm font-bold text-white sm:h-9 sm:w-9">
              {inisial}
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="max-w-40 truncate text-sm font-semibold text-slate-900">{user.nama_lengkap}</p>
              <p className="text-xs text-slate-500">{ROLE_LABEL[user.role]}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
