import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { createBuku } from "@/actions/buku";
import BukuForm from "@/components/BukuForm";

export const metadata = { title: "Tambah Buku" };

export default async function BukuBaruPage() {
  await requireRole("admin", "pegawai");
  const { rows: categories } = await pool.query(
    "SELECT id, nama, kode FROM categories ORDER BY nama"
  );

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Tambah Buku</h1>
      <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <BukuForm action={createBuku} categories={categories} submitLabel="Simpan" />
      </div>
    </main>
  );
}
