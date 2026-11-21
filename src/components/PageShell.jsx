import DashboardShell from "@/components/DashboardShell";
import PublicShell from "@/components/PublicShell";

// Untuk halaman yang boleh dibuka siapa saja (katalog, detail buku):
// pengguna login -> tampil di dashboard shell, Guest -> shell publik.
export default function PageShell({ user, title, subtitle, actions, children }) {
  if (user) {
    return (
      <DashboardShell user={user} title={title} subtitle={subtitle} actions={actions}>
        {children}
      </DashboardShell>
    );
  }
  return (
    <PublicShell user={null}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-slate-600 sm:text-base">{subtitle}</p> : null}
        </div>
        {children}
      </div>
    </PublicShell>
  );
}
