import AppSidebar from "@/components/AppSidebar";
import AppTopbar from "@/components/AppTopbar";

export default function DashboardShell({
  children,
  role = "umum",
  title,
  subtitle,
  actions,
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_30%),linear-gradient(to_bottom,_#f8fafc,_#eef2ff_100%)] text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <AppSidebar role={role} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopbar title={title} subtitle={subtitle} actions={actions} role={role} />
          <main className="w-full flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
