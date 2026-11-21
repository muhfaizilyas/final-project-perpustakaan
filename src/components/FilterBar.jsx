export default function FilterBar({ filters = [] }) {
  const filterItems = Array.isArray(filters) ? filters : [];

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-slate-100 bg-white p-3 shadow-sm shadow-slate-200/40 lg:flex-row lg:items-center lg:justify-between">
      <div className="grid flex-1 gap-3 sm:grid-cols-2">
        <label className="sr-only" htmlFor="book-category-filter">Kategori buku</label>
        <select
          id="book-category-filter"
          aria-label="Filter kategori buku"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
          defaultValue=""
        >
          <option value="">Semua kategori</option>
          {filterItems.filter((item) => item !== "Semua").map((filter) => (
            <option key={filter} value={filter}>{filter}</option>
          ))}
        </select>

        <label className="sr-only" htmlFor="book-sort-filter">Urutkan buku</label>
        <select
          id="book-sort-filter"
          aria-label="Urutkan buku"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
          defaultValue=""
        >
          <option value="">Urutkan berdasarkan</option>
          <option value="terbaru">Tahun terbit terbaru</option>
          <option value="rating">Rating tertinggi</option>
          <option value="stok">Stok terbanyak</option>
        </select>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold !text-white transition hover:bg-blue-700"
        >
          Terapkan
        </button>
        <button
          type="reset"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
