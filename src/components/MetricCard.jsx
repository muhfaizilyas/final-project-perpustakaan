export default function MetricCard({ label, value, note, tone = "sky" }) {
  const tones = {
    sky: "from-sky-500/15 to-sky-500/5 text-sky-700",
    emerald: "from-emerald-500/15 to-emerald-500/5 text-emerald-700",
    amber: "from-amber-500/15 to-amber-500/5 text-amber-700",
    rose: "from-rose-500/15 to-rose-500/5 text-rose-700",
  };

  return (
    <div className={`rounded-3xl border border-slate-200 bg-gradient-to-br ${tones[tone] ?? tones.sky} p-5 shadow-sm`}>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-3 text-3xl font-black tracking-tight text-slate-900">{value}</div>
      <p className="mt-2 text-sm text-slate-500">{note}</p>
    </div>
  );
}
