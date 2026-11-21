import { logoutAction } from "@/actions/auth";

// Server Component: form biasa yang memanggil Server Action, tanpa "use client".
export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
      >
        Keluar
      </button>
    </form>
  );
}
