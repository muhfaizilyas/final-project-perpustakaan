import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";

const categories = [
  ["Teknologi Informasi", "TI-01", "Aktif"],
  ["Sastra", "SA-02", "Aktif"],
  ["Matematika", "MT-03", "Aktif"],
  ["Bisnis", "BS-04", "Aktif"],
  ["Ilmu Sosial", "IS-05", "Draft"],
];

export default function CategoryPage() {
  return (
    <DashboardShell
      role="admin"
      title="Kategori Buku"
      subtitle="UI daftar kategori yang bersih dan siap dihubungkan dengan backend kategori."
      actions={(
        <>
          <StatusBadge tone="info">Master Data</StatusBadge>
          <Link href="/dashboard/admin/kategori/baru" className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold !text-white transition hover:bg-slate-800">
            Tambah Kategori
          </Link>
        </>
      )}
    >
      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nama Kategori</th>
                  <th className="px-4 py-3 font-semibold">Kode</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                {categories.map(([name, code, status]) => (
                  <tr key={name}>
                    <td className="px-4 py-3 font-medium text-slate-900">{name}</td>
                    <td className="px-4 py-3">{code}</td>
                    <td className="px-4 py-3"><StatusBadge tone={status === "Aktif" ? "success" : "warning"}>{status}</StatusBadge></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="rounded-xl bg-sky-600 px-3 py-2 text-xs font-semibold text-white">Edit</button>
                        <button className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <EmptyState
          title="Panel detail kategori"
          description="Area ini bisa dipakai untuk form input, pencarian, dan statistik kategori di tahap berikutnya."
          action={<Link href="/dashboard/admin/kategori/baru" className="rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-semibold !text-white transition hover:bg-sky-700">Buat kategori baru</Link>}
        />
      </div>
    </DashboardShell>
  );
}
