// Dipakai DI DALAM <form method="GET">: nilai filter masuk ke URL (?kategori=..&sort=..)
// dan dibaca server component lewat searchParams.
const field = "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100";

export default function FilterBar({ categories = [], kategori = "", sort = "judul", resetHref = "/katalog" }) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="grid flex-1 gap-3 sm:grid-cols-2">
        <select name="kategori" aria-label="Filter kategori buku" defaultValue={kategori} className={field}>
          <option value="">Semua kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.nama}</option>
          ))}
        </select>
        <select name="sort" aria-label="Urutkan buku" defaultValue={sort} className={field}>
          <option value="judul">Judul (A-Z)</option>
          <option value="tahun">Tahun terbit terbaru</option>
          <option value="rating">Rating tertinggi</option>
        </select>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button type="submit" className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold !text-white transition hover:bg-blue-700">
          Terapkan
        </button>
        <a href={resetHref} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          Reset
        </a>
      </div>
    </div>
  );
}
