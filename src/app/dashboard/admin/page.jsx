import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import MetricCard from "@/components/MetricCard";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";

const stats = [
  { label: "Admin Aktif", value: "3", note: "Pengelola sistem utama", tone: "sky" },
  { label: "Pegawai", value: "12", note: "Akun staf perpustakaan", tone: "emerald" },
  { label: "Mahasiswa", value: "428", note: "Pengguna terdaftar", tone: "amber" },
  { label: "Kategori", value: "18", note: "Master data buku", tone: "rose" },
];

const activities = [
  ["Tambah kategori baru", "2 menit lalu", "success"],
  ["Perbarui data pengguna", "14 menit lalu", "info"],
  ["Sinkronisasi buku populer", "1 jam lalu", "default"],
];

export default function AdminDashboardPage() {
  return (
    <DashboardShell
      role="admin"
      title="Dashboard Admin"
      subtitle="Panel pengelolaan utama untuk melihat statistik, kategori, dan aktivitas sistem."
      actions={(
        <>
          <StatusBadge tone="warning">Admin Panel</StatusBadge>
          <Link href="/dashboard/admin/kategori" className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold !text-white transition hover:bg-slate-800">
            Kelola Kategori
          </Link>
        </>
      )}
    >
      <div className="space-y-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => <MetricCard key={item.label} {...item} />)}
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Aktivitas Terbaru</h2>
                <p className="mt-1 text-sm text-slate-500">Log ringkas untuk memantau perubahan penting.</p>
              </div>
              <StatusBadge tone="info">Realtime look</StatusBadge>
            </div>
            <div className="mt-6 space-y-3">
              {activities.map(([title, time, tone]) => (
                <div key={title} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-900">{title}</p>
                    <p className="text-sm text-slate-500">{time}</p>
                  </div>
                  <StatusBadge tone={tone}>{tone === "success" ? "Berhasil" : tone === "info" ? "Info" : "Baru"}</StatusBadge>
                </div>
              ))}
            </div>
          </div>

          <EmptyState
            title="Ruang statistik tambahan"
            description="Area ini bisa dipakai untuk chart, laporan, atau ringkasan data ketika backend kamu sudah berkembang."
            action={<Link href="/dashboard/admin/kategori/baru" className="rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-semibold !text-white transition hover:bg-sky-700">Tambah Kategori</Link>}
          />
        </section>
      </div>
    </DashboardShell>
  );
}
