import { notFound } from "next/navigation";
import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { updatePengumuman } from "@/actions/pengumuman";
import PengumumanForm from "@/components/PengumumanForm";
import DashboardShell from "@/components/DashboardShell";

export const metadata = { title: "Edit Pengumuman" };

export default async function EditPengumumanPage({ params }) {
  const user = await requireRole("admin", "pegawai");

  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const pengumumanId = Number(id);

  const { rows } = await pool.query(
    `SELECT id, judul, konten, kategori, status, tanggal_rilis::text AS tanggal_rilis
       FROM announcements WHERE id = $1`,
    [pengumumanId]
  );
  if (rows.length === 0) notFound();

  return (
    <DashboardShell user={user} title="Edit Pengumuman" subtitle="Perbarui isi atau status publikasi pengumuman.">
      <div className="mx-auto max-w-2xl py-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <PengumumanForm
            action={updatePengumuman.bind(null, pengumumanId)}
            initial={rows[0]}
            submitLabel="Simpan Perubahan"
          />
        </div>
      </div>
    </DashboardShell>
  );
}
