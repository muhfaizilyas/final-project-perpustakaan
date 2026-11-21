import { notFound } from "next/navigation";
import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { updateBuku } from "@/actions/buku";
import BukuForm from "@/components/BukuForm";

export const metadata = { title: "Edit Buku" };

export default async function EditBukuPage({ params }) {
  await requireRole("admin", "pegawai");

  const { id } = await params;
  const bukuId = Number(id);
  if (!Number.isInteger(bukuId)) notFound();

  const [{ rows }, { rows: categories }] = await Promise.all([
    pool.query(
      `SELECT judul, isbn, pengarang, penerbit, tahun_terbit, category_id,
              stok_total, durasi_maks_pinjam, denda_per_hari::int AS denda_per_hari, cover_url
         FROM books WHERE id = $1`,
      [bukuId]
    ),
    pool.query("SELECT id, nama, kode FROM categories ORDER BY nama"),
  ]);
  if (rows.length === 0) notFound();

  // Semua nilai form berupa string
  const initial = Object.fromEntries(
    Object.entries(rows[0]).map(([k, val]) => [k, val == null ? "" : String(val)])
  );

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Edit Buku</h1>
      <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <BukuForm
          action={updateBuku.bind(null, bukuId)}
          categories={categories}
          initial={initial}
          submitLabel="Simpan Perubahan"
          isEdit
        />
      </div>
    </main>
  );
}
