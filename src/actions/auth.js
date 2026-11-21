"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";
import { dashboardPath } from "@/lib/auth";
import { validateLogin, validateRegister } from "@/lib/validation";

// state awal form: { errors: {}, message: "", values: {} }

export async function loginAction(prevState, formData) {
  const values = {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
  };
  const password = String(formData.get("password") ?? "");

  const errors = validateLogin({ email: values.email, password });
  if (Object.keys(errors).length > 0) {
    return { errors, message: "", values };
  }

  const { rows } = await pool.query(
    "SELECT id, password, role, is_active FROM users WHERE email = $1",
    [values.email]
  );
  const user = rows[0];

  // Pesan sengaja disamakan agar tidak membocorkan email mana yang terdaftar.
  const salah = { errors: {}, message: "Email atau password salah.", values };
  if (!user) return salah;

  const cocok = await bcrypt.compare(password, user.password);
  if (!cocok) return salah;

  if (!user.is_active) {
    return {
      errors: {},
      message: "Akun kamu dinonaktifkan. Hubungi admin perpustakaan.",
      values,
    };
  }

  await createSession(user.id);
  redirect(dashboardPath(user.role)); // redirect harus di luar try/catch
}

export async function registerAction(prevState, formData) {
  const values = {
    nama_lengkap: String(formData.get("nama_lengkap") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    nomor_identitas: String(formData.get("nomor_identitas") ?? "").trim(),
  };
  const password = String(formData.get("password") ?? "");
  const konfirmasi = String(formData.get("konfirmasi") ?? "");

  const errors = validateRegister({ ...values, password, konfirmasi });
  if (Object.keys(errors).length > 0) {
    return { errors, message: "", values };
  }

  // Cek duplikat email / NIM
  const dup = await pool.query(
    "SELECT email, nomor_identitas FROM users WHERE email = $1 OR nomor_identitas = $2",
    [values.email, values.nomor_identitas]
  );
  for (const row of dup.rows) {
    if (row.email === values.email) errors.email = "Email sudah terdaftar.";
    if (row.nomor_identitas === values.nomor_identitas)
      errors.nomor_identitas = "NIM sudah terdaftar.";
  }
  if (Object.keys(errors).length > 0) {
    return { errors, message: "", values };
  }

  const hash = await bcrypt.hash(password, 10);

  let userId;
  try {
    // role SELALU 'mahasiswa' dan ditentukan di server, bukan dari form.
    const { rows } = await pool.query(
      `INSERT INTO users (nama_lengkap, email, password, role, nomor_identitas)
       VALUES ($1, $2, $3, 'mahasiswa', $4)
       RETURNING id`,
      [values.nama_lengkap, values.email, hash, values.nomor_identitas]
    );
    userId = rows[0].id;
  } catch (err) {
    // 23505 = unique_violation (jaga-jaga kalau dua orang daftar bersamaan)
    if (err.code === "23505") {
      return {
        errors: {},
        message: "Email atau NIM sudah terdaftar.",
        values,
      };
    }
    throw err;
  }

  await createSession(userId);
  redirect(dashboardPath("mahasiswa"));
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
