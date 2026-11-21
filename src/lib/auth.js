import { cache } from "react";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { getSession } from "@/lib/session";

const HALAMAN_DASHBOARD = {
  admin: "/dashboard/admin",
  pegawai: "/dashboard/pegawai",
  mahasiswa: "/dashboard/mahasiswa",
};

export function dashboardPath(role) {
  return HALAMAN_DASHBOARD[role] ?? "/";
}

// User yang sedang login (null = Guest). Role selalu dibaca dari database,
// bukan dari cookie, jadi perubahan role / akun nonaktif langsung berlaku.
// cache() membuat query ini hanya jalan sekali per request.
export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session) return null;

  const { rows } = await pool.query(
    `SELECT id, nama_lengkap, email, role
       FROM users
      WHERE id = $1 AND is_active = TRUE`,
    [session.userId]
  );
  return rows[0] ?? null;
});

// Wajib login, kalau belum -> ke /login
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

// Wajib login DAN role termasuk daftar, contoh: requireRole("admin", "pegawai")
export async function requireRole(...roles) {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect("/dashboard");
  return user;
}
