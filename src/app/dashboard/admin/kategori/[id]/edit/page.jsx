import { notFound } from "next/navigation";
import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { updateKategori } from "@/actions/kategori";
import KategoriForm from "@/components/KategoriForm";

export const metadata = { title: "Edit Kategori - Admin" };

export default async function EditKategoriPage({ params }) {
  await requireRole("admin");

  const { id } = await params;
  const kategoriId = Number(id);
  if (!Number.isInteger(kategoriId)) notFound();

  const { rows } = await pool.query(
    "SELECT id, nama, kode, deskripsi FROM categories WHERE id = $1",
    [kategoriId]
  );
  if (rows.length === 0) notFound();

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Edit Kategori</h1>
      <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <KategoriForm
          action={updateKategori.bind(null, kategoriId)}
          initial={rows[0]}
          submitLabel="Simpan Perubahan"
        />
      </div>
    </main>
  );
}
