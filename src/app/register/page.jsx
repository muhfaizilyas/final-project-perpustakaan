import Link from "next/link";
import BrandMark from "@/components/BrandMark";

const notes = [
  "Mahasiswa bisa daftar langsung.",
  "Pegawai tetap mengikuti alur yang sudah disiapkan.",
  "Tampilan tetap konsisten dengan login dan dashboard.",
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-800 md:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/5 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="flex items-center justify-center bg-gradient-to-br from-sky-600 via-indigo-600 to-slate-900 p-8 text-white md:p-10 lg:p-12">
          <div className="max-w-md">
            <BrandMark />
            <h1 className="mt-8 text-4xl font-black tracking-tight md:text-5xl">
              Buat akun untuk mulai menjelajah RakBaca.
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-200 md:text-base">
              Halaman register ini dibuat sederhana, elegan, dan siap disambungkan ke backend nanti.
            </p>
            <div className="mt-10 space-y-3">
              {notes.map((note) => (
                <div key={note} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100 backdrop-blur">
                  {note}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 md:p-10 lg:p-12">
          <div className="w-full max-w-xl rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Daftar akun</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Buat profil baru</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Lengkapi data dasar untuk proses registrasi.</p>

            <form className="mt-8 grid gap-4 md:grid-cols-2">
              <label className="block md:col-span-1">
                <span className="mb-2 block text-sm font-medium text-slate-700">Nama lengkap</span>
                <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-white" placeholder="Nama kamu" />
              </label>
              <label className="block md:col-span-1">
                <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-white" placeholder="nama@email.ac.id" />
              </label>
              <label className="block md:col-span-1">
                <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                <input type="password" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-white" placeholder="••••••••" />
              </label>
              <label className="block md:col-span-1">
                <span className="mb-2 block text-sm font-medium text-slate-700">Role</span>
                <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-white">
                  <option>Mahasiswa</option>
                  <option>Pegawai</option>
                </select>
              </label>
              <div className="md:col-span-2">
                <button type="button" className="w-full rounded-2xl bg-slate-900 px-4 py-3.5 font-semibold text-white transition hover:bg-slate-800">
                  Daftar
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Sudah punya akun?{' '}
              <Link href="/login" className="font-semibold text-sky-600 hover:text-sky-700">
                Login di sini
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
