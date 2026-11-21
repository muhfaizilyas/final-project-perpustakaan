export default function StatusBadge({ children, tone = "default" }) {
  const styles = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-rose-50 text-rose-700",
    info: "bg-sky-50 text-sky-700",
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[tone] ?? styles.default}`}>
      {children}
    </span>
  );
}
