import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import BookCard from "@/components/BookCard";
import FilterBar from "@/components/FilterBar";
import StatusBadge from "@/components/StatusBadge";

const books = [
  { title: "Clean Code", author: "Robert C. Martin", category: "Teknologi Informasi", status: "Tersedia", stock: 12, rating: "4.9" },
  { title: "Atomic Habits", author: "James Clear", category: "Pengembangan Diri", status: "Dipinjam", stock: 5, rating: "4.8" },
  { title: "Laskar Pelangi", author: "Andrea Hirata", category: "Sastra", status: "Tersedia", stock: 7, rating: "4.7" },
  { title: "Algoritma & Struktur Data", author: "Andi Pratama", category: "Teknik Informatika", status: "Tersedia", stock: 8, rating: "4.6" },
  { title: "Database System Concepts", author: "Silberschatz", category: "Basis Data", status: "Tersedia", stock: 4, rating: "4.9" },
  { title: "Matematika Diskrit", author: "Kenneth Rosen", category: "Matematika", status: "Dipinjam", stock: 3, rating: "4.5" },
];

export default function BukuCatalogPage() {
  return (
    <DashboardShell
      role="umum"
      title="Katalog Buku"
      subtitle="Tampilan katalog yang lebih modern untuk browsing, filter, dan detail buku."
      actions={(
        <>
          <StatusBadge tone="info">Katalog</StatusBadge>
          <Link href="/login" className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold !text-white transition hover:bg-slate-800">
            Ajukan Pinjam
          </Link>
        </>
      )}
    >
      <div className="space-y-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Cari buku</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Jelajahi koleksi perpustakaan</h2>
              <p className="mt-2 text-sm text-slate-500">Gunakan pencarian dan filter untuk menemukan buku lebih cepat.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-3">
              <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-400" aria-label="Cari judul, penulis, atau kategori" placeholder="Cari judul, penulis, atau kategori..." />
            </div>
          </div>
          <div className="mt-5">
            <FilterBar filters={["Semua", "Teknologi", "Sastra", "Matematika", "Bisnis", "Pemrograman"]} />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => <BookCard key={book.title} {...book} />)}
        </section>
      </div>
    </DashboardShell>
  );
}
