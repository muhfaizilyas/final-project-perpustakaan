import BrandMark from "@/components/BrandMark";
import Link from "next/link";

export default function PublicShell({ children }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/80 bg-white/75 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <BrandMark href="/" />
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link href="/#fitur" className="hover:text-blue-700">Fitur</Link>
            <Link href="/#koleksi" className="hover:text-blue-700">Koleksi</Link>
            <Link href="/#pengumuman" className="hover:text-blue-700">Pengumuman</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-2xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white hover:text-blue-700 hover:shadow-sm">Masuk</Link>
            <Link href="/register" className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 hover:bg-blue-700">Daftar</Link>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
