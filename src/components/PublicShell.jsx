import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import LogoutButton from "@/components/LogoutButton";
import { dashboardPath } from "@/lib/auth";

// Kerangka halaman publik (beranda, katalog, detail buku untuk Guest).
// user = null berarti Guest.
export default function PublicShell({ children, user = null }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-white/80 bg-white/75 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <BrandMark href="/" />
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link href="/katalog" className="hover:text-blue-700">Katalog</Link>
            <Link href="/#koleksi" className="hover:text-blue-700">Buku Populer</Link>
            <Link href="/pengumuman" className="hover:text-blue-700">Pengumuman</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <Link
                  href={dashboardPath(user.role)}
                  className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold !text-white shadow-lg shadow-slate-900/15 hover:bg-blue-700"
                >
                  Dashboard
                </Link>
                <div className="hidden sm:block"><LogoutButton /></div>
              </>
            ) : (
              <>
                <Link href="/login" className="rounded-2xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white hover:text-blue-700 hover:shadow-sm">Masuk</Link>
                <Link href="/register" className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold !text-white shadow-lg shadow-slate-900/15 hover:bg-blue-700">Daftar</Link>
              </>
            )}
          </div>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="border-t border-slate-200 bg-white/70 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} RakBaca · Perpustakaan Kampus
      </footer>
    </div>
  );
}
