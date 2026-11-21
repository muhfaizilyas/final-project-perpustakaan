import { requireRole } from "@/lib/auth";
import { createKategori } from "@/actions/kategori";
import KategoriForm from "@/components/KategoriForm";

export const metadata = { title: "Tambah Kategori - Admin" };

export default async function KategoriBaruPage() {
  await requireRole("admin");

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Tambah Kategori</h1>
      <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <KategoriForm action={createKategori} submitLabel="Simpan" />
      </div>
    </main>
  );
}
