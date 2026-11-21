import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import MetricCard from "@/components/MetricCard";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";

const stats = [
  { label: "Pengajuan Baru", value: "24", note: "Menunggu pemeriksaan", tone: "sky" },
  { label: "Sedang Dipinjam", value: "61", note: "Transaksi aktif", tone: "emerald" },
  { label: "Perlu Konfirmasi", value: "11", note: "Pengembalian menunggu", tone: "amber" },
  { label: "Denda", value: "Rp 1.250K", note: "Akumulasi keterlambatan", tone: "rose" },
];

export default function PegawaiDashboardPage() {
  return (
    <DashboardShell
      role="pegawai"
      title="Dashboard Pegawai"
      subtitle="Panel untuk memantau peminjaman, pengembalian, dan pengumuman operasional perpustakaan."
      actions={(
        <>
          <StatusBadge tone="success">Pegawai</StatusBadge>
          <Link href="/dashboard/buku" className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold !text-white transition hover:bg-slate-800">
            Kelola Buku
          </Link>
        </>
      )}
    >
      <div className="space-y-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => <MetricCard key={item.label} {...item} />)}
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Antrian Pemeriksaan</h2>
                <p className="mt-1 text-sm text-slate-500">Daftar pengajuan pinjam yang siap di-approve atau ditolak.</p>
              </div>
              <StatusBadge tone="warning">6 pending</StatusBadge>
            </div>
            <div className="mt-6 space-y-3">
              {[
                ["Siti Aisyah", "Clean Code", "Menunggu Konfirmasi"],
                ["Bima Pratama", "Atomic Habits", "Menunggu Konfirmasi"],
                ["Nadya Putri", "Algoritma & Struktur Data", "Menunggu Konfirmasi"],
              ].map(([name, book, status]) => (
                <div key={name} className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{name}</p>
                    <p className="text-sm text-slate-500">{book}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge tone="info">{status}</StatusBadge>
                    <button className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">Approve</button>
                    <button className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <EmptyState
            title="Pengembalian dan denda"
            description="Panel ini bisa dipakai untuk proses retur buku dan pencatatan denda saat backend dihubungkan nanti."
            action={<Link href="/dashboard/buku" className="rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-semibold !text-white transition hover:bg-sky-700">Buka katalog buku</Link>}
          />
        </section>
      </div>
    </DashboardShell>
  );
}
