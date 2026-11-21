import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, dashboardPath } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export const metadata = { title: "Masuk - Perpustakaan Kampus" };

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(dashboardPath(user.role)); // sudah login

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <h1 className="text-2xl font-bold">Masuk</h1>
        <p className="mb-6 mt-1 text-sm text-slate-500">
          Masuk ke akun perpustakaan kampus kamu.
        </p>
        <LoginForm />
        <div className="mt-6 space-y-2 text-center text-sm">
          <p>
            Belum punya akun?{" "}
            <Link href="/register" className="font-medium text-indigo-600 hover:underline">
              Daftar
            </Link>
          </p>
          <p>
            <Link href="/" className="text-slate-500 hover:underline">
              Lanjutkan sebagai Guest
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
