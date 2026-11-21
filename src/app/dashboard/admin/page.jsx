import Link from "next/link";
import { requireRole } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardAdmin() {
  const user = await requireRole("admin");

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <LogoutButton />
      </div>
      <p className="mt-2 text-slate-600">Halo, {user.nama_lengkap}.</p>

      <nav className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/dashboard/admin/kategori"
          className="rounded-xl bg-white p-4 ring-1 ring-slate-200 hover:ring-indigo-400"
        >
          <p className="font-semibold">Kategori</p>
          <p className="text-sm text-slate-500">Kelola kategori buku</p>
        </Link>
        <Link
          href="/dashboard/buku"
          className="rounded-xl bg-white p-4 ring-1 ring-slate-200 hover:ring-indigo-400"
        >
          <p className="font-semibold">Buku</p>
          <p className="text-sm text-slate-500">Kelola koleksi buku dan stok</p>
        </Link>
      </nav>
    </main>
  );
}
