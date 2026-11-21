export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
        ✨
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
