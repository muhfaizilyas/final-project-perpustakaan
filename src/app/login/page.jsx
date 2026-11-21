"use client";

import Link from "next/link";
import { useActionState } from "react";
import BrandMark from "@/components/BrandMark";
import { loginAction } from "@/actions/auth";

const initialState = { errors: {}, message: "", values: {} };

const features = [
  ["Akses multi role", "Admin, Pegawai, dan Mahasiswa."],
  ["Katalog modern", "Tampilan bersih untuk pencarian buku."],
  ["Persiapan demo", "Siap dipresentasikan dengan rapi."],
];

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_35%),linear-gradient(to_bottom,_#f8fafc,_#eef2ff_100%)] px-4 py-8 text-slate-800 md:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 shadow-2xl shadow-slate-900/5 backdrop-blur xl:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-between bg-slate-950 p-8 text-white md:p-10 lg:p-12">
          <div>
            <BrandMark variant="inverse" />
            <p className="mt-8 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
              Sistem Manajemen Perpustakaan
            </p>
            <h1 className="mt-5 max-w-xl text-4xl font-black tracking-tight md:text-5xl">
              Masuk ke RakBaca dengan tampilan yang lebih rapi.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
              UI ini dibuat untuk memperkuat presentasi final project perpustakaan, dengan alur login yang bersih dan modern.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {features.map(([title, desc]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center p-6 md:p-10 lg:p-12">
          <div className="w-full max-w-md rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Selamat datang</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Login ke akunmu</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Gunakan akun yang sudah disiapkan untuk masuk ke dashboard.
              </p>
            </div>

            <form action={formAction} className="mt-8 space-y-4" noValidate>
              {state.message ? (
                <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {state.message}
                </p>
              ) : null}

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                <input
                  name="email"
                  type="email"
                  defaultValue={state.values?.email ?? ""}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white"
                  placeholder="nama@email.ac.id"
                />
                {state.errors?.email ? (
                  <p className="mt-1.5 text-xs text-red-600">{state.errors.email}</p>
                ) : null}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                <input
                  name="password"
                  type="password"
                  defaultValue=""
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white"
                  placeholder="••••••••"
                />
                {state.errors?.password ? (
                  <p className="mt-1.5 text-xs text-red-600">{state.errors.password}</p>
                ) : null}
              </label>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    name="remember"
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  Ingat saya
                </label>
                <a href="#" className="font-medium text-sky-600 hover:text-sky-700">
                  Lupa password?
                </a>
              </div>

              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-2xl bg-slate-900 px-4 py-3.5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Memproses..." : "Masuk"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Belum punya akun?{" "}
              <Link href="/register" className="font-semibold text-sky-600 hover:text-sky-700">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}