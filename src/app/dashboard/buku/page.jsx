import Link from "next/link";
import pool from "@/lib/db";
import { requireRole, dashboardPath } from "@/lib/auth";
import HapusBukuButton from "@/components/HapusBukuButton";

export const metadata = { title: "Manajemen Buku" };

const PESAN = {
  dibuat: "Buku berhasil ditambahkan.",
  diubah: "Buku berhasil diperbarui.",
  dihapus: "Buku berhasil dihapus.",
};

export default async function BukuPage({ searchParams }) {
  const user = await requireRole("admin", "pegawai");
  const { status, q = "", kategori = "" } = await searchParams;

  const kategoriId = /^\d+$/.test(kategori) ? Number(kategori) : null;
  const keyword = String(q).trim();

  const [{ rows: buku }, { rows: daftarKategori }] = await Promise.all([
    pool.query(
      `SELECT b.id, b.judul, b.isbn, b.pengarang, b.tahun_terbit,
              b.stok_total, b.stok_tersedia, c.nama AS kategori
         FROM books b
         JOIN categories c ON c.id = b.category_id
        WHERE ($1 = ''
               OR b.judul     ILIKE '%' || $1 || '%'
               OR b.pengarang ILIKE '%' || $1 || '%'
               OR b.isbn      ILIKE '%' || $1 || '%')
          AND ($2::int IS NULL OR b.category_id = $2::int)
        ORDER BY b.judul`,
      [keyword, kategoriId]
    ),
    pool.query("SELECT id, nama FROM categories ORDER BY nama"),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link href={dashboardPath(user.role)} className="text-sm text-slate-500 hover:underline">
        &larr; Dashboard
      </Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Manajemen Buku</h1>
        <Link
          href="/dashboard/buku/baru"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + Tambah Buku
        </Link>
      </div>

      {PESAN[status] && (
        <p role="status" className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          {PESAN[status]}
        </p>
      )}

      {/* Form GET biasa: hasil pencarian tercermin di URL (?q=...&kategori=...) */}
      <form method="GET" className="mt-6 flex flex-wrap gap-3">
        <input
          type="search"
          name="q"
          defaultValue={keyword}
          placeholder="Cari judul, pengarang, atau ISBN"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          name="kategori"
          defaultValue={kategoriId ?? ""}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">Semua kategori</option>
          {daftarKategori.map((c) => (
            <option key={c.id} value={c.id}>{c.nama}</option>
          ))}
        </select>
        <button type="submit" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm hover:bg-slate-100">
          Cari
        </button>
        {(keyword || kategoriId) && (
          <Link href="/dashboard/buku" className="px-2 py-2 text-sm text-slate-500 hover:underline">
            Reset
          </Link>
        )}
      </form>

      <div className="mt-4 overflow-x-auto rounded-xl bg-white ring-1 ring-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Judul</th>
              <th className="px-4 py-3 font-medium">Pengarang</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium">Tahun</th>
              <th className="px-4 py-3 font-medium">Stok</th>
              <th className="px-4 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {buku.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  Tidak ada buku yang cocok.
                </td>
              </tr>
            )}
            {buku.map((b) => (
              <tr key={b.id} className="align-top">
                <td className="px-4 py-3">
                  <p className="font-medium">{b.judul}</p>
                  <p className="font-mono text-xs text-slate-500">{b.isbn}</p>
                </td>
                <td className="px-4 py-3">{b.pengarang}</td>
                <td className="px-4 py-3">{b.kategori}</td>
                <td className="px-4 py-3">{b.tahun_terbit}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      b.stok_tersedia > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}
                  >
                    {b.stok_tersedia} / {b.stok_total}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link href={`/dashboard/buku/${b.id}/edit`} className="text-sm text-indigo-600 hover:underline">
                      Edit
                    </Link>
                    <HapusBukuButton id={b.id} judul={b.judul} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-slate-500">Stok: tersedia / total.</p>
    </main>
  );
}
