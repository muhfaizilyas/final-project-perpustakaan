import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import MetricCard from "@/components/MetricCard";
import BookCard from "@/components/BookCard";
import AnnouncementCard from "@/components/AnnouncementCard";
import StatusBadge from "@/components/StatusBadge";

const stats = [
  { label: "Total Buku", value: "1.248", note: "Koleksi aktif di sistem", tone: "sky" },
  { label: "Transaksi Aktif", value: "86", note: "Sedang dipinjam mahasiswa", tone: "emerald" },
  { label: "Denda Tertunggak", value: "12", note: "Butuh tindak lanjut pegawai", tone: "amber" },
  { label: "Pengumuman", value: "7", note: "Info operasional terbaru", tone: "rose" },
];

const books = [
  { title: "Clean Code", author: "Robert C. Martin", category: "Teknologi Informasi", status: "Tersedia", stock: 12, rating: "4.9" },
  { title: "Atomic Habits", author: "James Clear", category: "Pengembangan Diri", status: "Dipinjam", stock: 5, rating: "4.8" },
  { title: "Algoritma & Struktur Data", author: "Andi Pratama", category: "Teknik Informatika", status: "Tersedia", stock: 8, rating: "4.7" },
];

const announcements = [
  { title: "Jam layanan berubah pada hari Jumat", category: "Operasional", date: "Hari ini", excerpt: "Layanan peminjaman di meja sirkulasi akan ditutup lebih awal karena pemeliharaan sistem." },
  { title: "Tambahan koleksi buku baru", category: "Koleksi", date: "Kemarin", excerpt: "Beberapa buku teknologi dan bisnis baru telah tersedia di rak utama." },
];

export default function DashboardHomePage() {
  return (
    <DashboardShell
      role="umum"
      title="Ringkasan Perpustakaan"
      subtitle="Halaman awal yang menampilkan gambaran umum koleksi, aktivitas, dan pengumuman perpustakaan."
      actions={(
        <>
          <StatusBadge tone="info">Demo UI</StatusBadge>
          <Link href="/login" className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold !text-white transition hover:bg-slate-800">
            Login
          </Link>
        </>
      )}
    >
      <div className="space-y-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => <MetricCard key={item.label} {...item} />)}
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.45fr_0.85fr]">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Buku Pilihan</h2>
                <p className="mt-1 text-sm text-slate-500">Kartu buku dengan visual yang lebih bersih untuk catalog view.</p>
              </div>
              <Link href="/dashboard/buku" className="text-sm font-semibold text-sky-600 hover:text-sky-700">
                Lihat semua
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {books.map((book) => <BookCard key={book.title} {...book} />)}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Pengumuman</h2>
              <p className="mt-1 text-sm text-slate-500">Info penting yang tampil ringkas dan mudah dibaca.</p>
            </div>
            <div className="space-y-4">
              {announcements.map((item) => <AnnouncementCard key={item.title} {...item} />)}
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
