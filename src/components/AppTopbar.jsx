"use client";

export default function AppTopbar({ title, subtitle, actions }) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur md:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">
          RakBaca
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {actions}
      </div>
    </header>
  );
}
