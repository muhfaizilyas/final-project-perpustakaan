import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, dashboardPath } from "@/lib/auth";
import RegisterForm from "@/components/RegisterForm";

export const metadata = { title: "Daftar - Perpustakaan Kampus" };

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect(dashboardPath(user.role));

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <h1 className="text-2xl font-bold">Daftar Mahasiswa</h1>
        <p className="mb-6 mt-1 text-sm text-slate-500">
          Pendaftaran hanya untuk mahasiswa dengan email kampus.
        </p>
        <RegisterForm />
        <p className="mt-6 text-center text-sm">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-indigo-600 hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </main>
  );
}
