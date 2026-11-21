export default function FilterBar({ filters = [] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((item) => (
        <button
          key={item}
          type="button"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
        >
          {item}
        </button>
      ))}
    </div>
  );
}
