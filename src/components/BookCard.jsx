export default function BookCard({ title, author, category, status, rating = "4.8", badge = "Populer" }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-600 text-2xl font-black text-white shadow-lg">
          📚
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              {badge}
            </span>
            <span className="text-xs font-medium text-slate-500">⭐ {rating}</span>
          </div>
          <h3 className="mt-3 line-clamp-2 text-lg font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{author}</p>
          <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500">
            <span>{category}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">{status}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
