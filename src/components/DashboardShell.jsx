import AppSidebar from "./AppSidebar";
import AppTopbar from "./AppTopbar";

export default function DashboardShell({ role, title, subtitle, actions, children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <AppSidebar role={role} />
        <div className="flex min-h-screen flex-1 flex-col">
          <AppTopbar title={title} subtitle={subtitle} actions={actions} />
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
