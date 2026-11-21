import Link from "next/link";
import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";
import HapusKategoriButton from "@/components/HapusKategoriButton";

export const metadata = { title: "Kategori - Admin" };

const PESAN = {
  dibuat: "Kategori berhasil ditambahkan.",
  diubah: "Kategori berhasil diperbarui.",
  dihapus: "Kategori berhasil dihapus.",
};

export default async function KategoriPage({ searchParams }) {
  await requireRole("admin");
  const { status } = await searchParams;

  // LEFT JOIN + COUNT: kategori tanpa buku tetap muncul dengan jumlah 0
  const { rows: kategori } = await pool.query(
    `SELECT c.id, c.nama, c.kode, c.deskripsi, COUNT(b.id)::int AS jumlah_buku
       FROM categories c
       LEFT JOIN books b ON b.category_id = c.id
      GROUP BY c.id
      ORDER BY c.nama`
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/dashboard/admin" className="text-sm text-slate-500 hover:underline">
        &larr; Dashboard
      </Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Manajemen Kategori</h1>
        <Link
          href="/dashboard/admin/kategori/baru"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + Tambah Kategori
        </Link>
      </div>

      {PESAN[status] && (
        <p role="status" className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          {PESAN[status]}
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl bg-white ring-1 ring-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Kode</th>
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">Deskripsi</th>
              <th className="px-4 py-3 font-medium">Jumlah Buku</th>
              <th className="px-4 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {kategori.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  Belum ada kategori.
                </td>
              </tr>
            )}
            {kategori.map((k) => (
              <tr key={k.id} className="align-top">
                <td className="px-4 py-3 font-mono">{k.kode}</td>
                <td className="px-4 py-3 font-medium">{k.nama}</td>
                <td className="px-4 py-3 text-slate-600">{k.deskripsi ?? "-"}</td>
                <td className="px-4 py-3">{k.jumlah_buku}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link
                      href={`/dashboard/admin/kategori/${k.id}/edit`}
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <HapusKategoriButton id={k.id} nama={k.nama} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
