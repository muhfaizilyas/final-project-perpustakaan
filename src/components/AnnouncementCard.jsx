export default function AnnouncementCard({ title, category, date, excerpt }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          {category}
        </span>
        <span className="text-xs text-slate-500">{date}</span>
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{excerpt}</p>
    </article>
  );
}
