import Link from "next/link";
import { getCurrentUser, dashboardPath } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

// SEMENTARA: nanti diganti homepage asli (buku populer, pengumuman, pencarian).
export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Perpustakaan Kampus</h1>
      {user ? (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <p>
            Halo, <b>{user.nama_lengkap}</b> ({user.role})
          </p>
          <Link href={dashboardPath(user.role)} className="text-indigo-600 hover:underline">
            Ke dashboard
          </Link>
          <LogoutButton />
        </div>
      ) : (
        <div className="mt-6 flex gap-4">
          <p className="text-slate-500">Kamu masuk sebagai Guest.</p>
          <Link href="/login" className="text-indigo-600 hover:underline">Masuk</Link>
          <Link href="/register" className="text-indigo-600 hover:underline">Daftar</Link>
        </div>
      )}
    </main>
  );
}
