import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import PageShell from "@/components/PageShell";
import BookCard from "@/components/BookCard";
import FilterBar from "@/components/FilterBar";
import EmptyState from "@/components/EmptyState";

export const metadata = { title: "Katalog Buku" };

// Urutan dipilih dari daftar tetap (whitelist), nilai dari URL tidak pernah
// disisipkan langsung ke SQL.
const URUTAN = {
  judul: "b.judul",
  tahun: "b.tahun_terbit DESC, b.judul",
  rating: "rating DESC NULLS LAST, b.judul",
};

export default async function KatalogPage({ searchParams }) {
  const user = await getCurrentUser();
  const { q = "", kategori = "", sort = "judul" } = await searchParams;

  const keyword = String(q).trim();
  const kategoriId = /^\d+$/.test(kategori) ? Number(kategori) : null;
  const urutan = URUTAN[sort] ? sort : "judul";

  const [{ rows: buku }, { rows: daftarKategori }] = await Promise.all([
    pool.query(
      `SELECT b.id, b.judul, b.pengarang, b.tahun_terbit, b.stok_tersedia,
              c.nama AS kategori,
              ROUND(AVG(r.rating), 1)::text AS rating
         FROM books b
         JOIN categories c ON c.id = b.category_id
         LEFT JOIN loans l   ON l.book_id = b.id
         LEFT JOIN reviews r ON r.loan_id = l.id
        WHERE ($1 = ''
               OR b.judul     ILIKE '%' || $1 || '%'
               OR b.pengarang ILIKE '%' || $1 || '%'
               OR c.nama      ILIKE '%' || $1 || '%')
          AND ($2::int IS NULL OR b.category_id = $2::int)
        GROUP BY b.id, c.nama
        ORDER BY ${URUTAN[urutan]}`,
      [keyword, kategoriId]
    ),
    pool.query("SELECT id, nama FROM categories ORDER BY nama"),
  ]);

  return (
    <PageShell
      user={user}
      title="Katalog Buku"
      subtitle="Cari dan jelajahi koleksi perpustakaan kampus."
    >
      <div className="space-y-6">
        <form method="GET" className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <input
            type="search"
            name="q"
            defaultValue={keyword}
            aria-label="Cari judul, pengarang, atau kategori"
            placeholder="Cari judul, pengarang, atau kategori..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
          />
          <FilterBar categories={daftarKategori} kategori={kategoriId ?? ""} sort={urutan} />
        </form>

        <p className="text-sm text-slate-500">{buku.length} buku ditemukan</p>

        {buku.length === 0 ? (
          <EmptyState title="Buku tidak ditemukan" description="Coba kata kunci lain atau ubah filter kategori." />
        ) : (
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {buku.map((b) => (
              <BookCard
                key={b.id}
                judul={b.judul}
                pengarang={b.pengarang}
                kategori={b.kategori}
                stok_tersedia={b.stok_tersedia}
                rating={b.rating}
                href={`/buku/${b.id}`}
              />
            ))}
          </section>
        )}
      </div>
    </PageShell>
  );
}
