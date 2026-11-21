"use server";

import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { validateBuku } from "@/lib/validation";

const LIST_URL = "/dashboard/buku";
const FIELDS = [
  "judul", "isbn", "pengarang", "penerbit", "tahun_terbit",
  "category_id", "stok_total", "durasi_maks_pinjam", "denda_per_hari", "cover_url",
];

function bacaForm(formData) {
  const values = {};
  for (const f of FIELDS) values[f] = String(formData.get(f) ?? "").trim();
  return values;
}

// ISBN dibandingkan tanpa tanda hubung/spasi, supaya 978-602-1 dan 9786021 dianggap sama.
async function isbnSudahAda(isbn, kecualiId = null) {
  const bersih = isbn.replace(/[-\s]/g, "");
  const { rows } = await pool.query(
    `SELECT 1 FROM books
      WHERE REPLACE(REPLACE(isbn, '-', ''), ' ', '') = $1
        AND ($2::int IS NULL OR id <> $2::int)`,
    [bersih, kecualiId]
  );
  return rows.length > 0;
}

async function kategoriAda(categoryId) {
  const { rows } = await pool.query("SELECT 1 FROM categories WHERE id = $1", [categoryId]);
  return rows.length > 0;
}

export async function createBuku(prevState, formData) {
  await requireRole("admin", "pegawai");

  const values = bacaForm(formData);
  const errors = validateBuku(values);
  if (!errors.isbn && (await isbnSudahAda(values.isbn))) errors.isbn = "ISBN sudah terdaftar.";
  if (!errors.category_id && !(await kategoriAda(Number(values.category_id))))
    errors.category_id = "Kategori tidak ditemukan.";
  if (Object.keys(errors).length > 0) return { errors, message: "", values };

  try {
    // Buku baru: semua eksemplar tersedia (stok_tersedia = stok_total)
    await pool.query(
      `INSERT INTO books
         (judul, isbn, pengarang, penerbit, tahun_terbit, category_id,
          stok_total, stok_tersedia, durasi_maks_pinjam, denda_per_hari, cover_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $7, $8, $9, $10)`,
      [
        values.judul, values.isbn, values.pengarang, values.penerbit,
        Number(values.tahun_terbit), Number(values.category_id),
        Number(values.stok_total), Number(values.durasi_maks_pinjam),
        Number(values.denda_per_hari), values.cover_url || null,
      ]
    );
  } catch (err) {
    if (err.code === "23505") {
      return { errors: { isbn: "ISBN sudah terdaftar." }, message: "", values };
    }
    throw err;
  }

  redirect(`${LIST_URL}?status=dibuat`);
}

// Dipanggil dengan .bind(null, id) dari halaman edit
export async function updateBuku(id, prevState, formData) {
  await requireRole("admin", "pegawai");

  const values = bacaForm(formData);
  const errors = validateBuku(values);
  if (!errors.isbn && (await isbnSudahAda(values.isbn, id))) errors.isbn = "ISBN sudah terdaftar.";
  if (!errors.category_id && !(await kategoriAda(Number(values.category_id))))
    errors.category_id = "Kategori tidak ditemukan.";

  // Stok total tidak boleh lebih kecil dari jumlah eksemplar yang sedang dipinjam.
  if (!errors.stok_total) {
    const { rows } = await pool.query(
      `SELECT COUNT(*)::int AS dipinjam FROM loans
        WHERE book_id = $1 AND status_pinjam = 'Sedang Dipinjam'`,
      [id]
    );
    if (Number(values.stok_total) < rows[0].dipinjam) {
      errors.stok_total = `Stok total tidak boleh kurang dari ${rows[0].dipinjam} (jumlah yang sedang dipinjam).`;
    }
  }
  if (Object.keys(errors).length > 0) return { errors, message: "", values };

  try {
    // stok_tersedia dihitung ulang = stok_total - jumlah yang sedang dipinjam
    const result = await pool.query(
      `UPDATE books
          SET judul = $1, isbn = $2, pengarang = $3, penerbit = $4,
              tahun_terbit = $5, category_id = $6, stok_total = $7::int,
              stok_tersedia = $7::int - (
                SELECT COUNT(*)::int FROM loans
                 WHERE book_id = $11 AND status_pinjam = 'Sedang Dipinjam'),
              durasi_maks_pinjam = $8, denda_per_hari = $9, cover_url = $10
        WHERE id = $11`,
      [
        values.judul, values.isbn, values.pengarang, values.penerbit,
        Number(values.tahun_terbit), Number(values.category_id),
        Number(values.stok_total), Number(values.durasi_maks_pinjam),
        Number(values.denda_per_hari), values.cover_url || null, id,
      ]
    );
    if (result.rowCount === 0) {
      return { errors: {}, message: "Buku tidak ditemukan.", values };
    }
  } catch (err) {
    if (err.code === "23505") {
      return { errors: { isbn: "ISBN sudah terdaftar." }, message: "", values };
    }
    throw err;
  }

  redirect(`${LIST_URL}?status=diubah`);
}

export async function deleteBuku(prevState, formData) {
  await requireRole("admin", "pegawai");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { message: "ID tidak valid." };

  // Aturan: buku yang sedang dipinjam (atau masih punya pengajuan aktif) tidak boleh dihapus
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS aktif FROM loans
      WHERE book_id = $1
        AND status_pinjam IN ('Sedang Dipinjam', 'Menunggu Konfirmasi')`,
    [id]
  );
  if (rows[0].aktif > 0) {
    return {
      message: `Tidak bisa dihapus: ada ${rows[0].aktif} peminjaman aktif untuk buku ini.`,
    };
  }

  await pool.query("DELETE FROM books WHERE id = $1", [id]);
  redirect(`${LIST_URL}?status=dihapus`);
}
