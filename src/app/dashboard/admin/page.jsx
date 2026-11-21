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
    </main>
  );
}
