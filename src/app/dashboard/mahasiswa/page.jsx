import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import MetricCard from "@/components/MetricCard";
import BookCard from "@/components/BookCard";
import StatusBadge from "@/components/StatusBadge";

const stats = [
  { label: "Sedang Dipinjam", value: "4", note: "Buku aktif yang kamu pegang", tone: "sky" },
  { label: "Riwayat Selesai", value: "17", note: "Transaksi yang sudah selesai", tone: "emerald" },
  { label: "Denda", value: "Rp 0", note: "Tidak ada tanggungan aktif", tone: "amber" },
  { label: "Favorit", value: "9", note: "Buku yang disimpan", tone: "rose" },
];

const books = [
  { title: "Clean Code", author: "Robert C. Martin", category: "Teknologi Informasi", status: "Jatuh tempo 4 hari", stock: 12, rating: "4.9" },
  { title: "Design Pattern", author: "Erich Gamma", category: "Teknik Informatika", status: "Jatuh tempo 8 hari", stock: 8, rating: "4.7" },
  { title: "Atomic Habits", author: "James Clear", category: "Pengembangan Diri", status: "Jatuh tempo 2 hari", stock: 5, rating: "4.8" },
];

export default function MahasiswaDashboardPage() {
  return (
    <DashboardShell
      role="mahasiswa"
      title="Dashboard Mahasiswa"
      subtitle="Pantau buku dipinjam, denda, dan rekomendasi bacaan dalam tampilan yang lebih nyaman."
      actions={(
        <>
          <StatusBadge tone="success">Mahasiswa</StatusBadge>
          <Link href="/dashboard/buku" className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold !text-white transition hover:bg-slate-800">
            Jelajahi Buku
          </Link>
        </>
      )}
    >
      <div className="space-y-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => <MetricCard key={item.label} {...item} />)}
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Buku Sedang Dipinjam</h2>
                <p className="mt-1 text-sm text-slate-500">Kartu ringkas agar mahasiswa mudah melihat deadline.</p>
              </div>
              <Link href="/dashboard/buku" className="text-sm font-semibold text-sky-600 hover:text-sky-700">
                Cari buku lain
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {books.map((book) => <BookCard key={book.title} {...book} badge="Dipinjam" />)}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Status Terkini</h2>
                <p className="mt-1 text-sm text-slate-500">Area untuk notifikasi dan pengingat.</p>
              </div>
              <StatusBadge tone="info">Aktif</StatusBadge>
            </div>

            <div className="mt-6 space-y-3">
              {[
                ["Pengajuan perpanjangan", "Disetujui"],
                ["Pengembalian buku", "Menunggu"],
                ["Pengumuman perpustakaan", "Baru"],
              ].map(([label, status]) => (
                <div key={label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-900">{label}</p>
                    <p className="text-sm text-slate-500">Status kegiatan</p>
                  </div>
                  <StatusBadge tone={status === "Disetujui" ? "success" : status === "Baru" ? "warning" : "info"}>{status}</StatusBadge>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
