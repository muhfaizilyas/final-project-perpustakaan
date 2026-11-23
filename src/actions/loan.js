"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import pool from "@/lib/db";
import { parseId } from "@/lib/id";
import { requireRole } from "@/lib/auth";
import { validateUlasan, validateAlasanTolak } from "@/lib/validation";

// Semua action mengembalikan { ok, message } (kecuali yang redirect).

const gagal = (message) => ({ ok: false, message });
const berhasil = (message) => ({ ok: true, message });

function idDariForm(formData, nama = "id") {
  return parseId(formData.get(nama));
}

function segarkan() {
  revalidatePath("/", "layout");
}

// Membungkus beberapa query dalam satu transaksi SQL (BEGIN / COMMIT).
async function dalamTransaksi(fn) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const hasil = await fn(client);
    await client.query("COMMIT");
    return hasil;
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

// Total denda berstatus Tertunggak milik seorang mahasiswa.
// `db` boleh pool (query biasa) atau client transaksi.
async function totalDendaTertunggak(db, userId) {
  const { rows } = await db.query(
    `SELECT COALESCE(SUM(denda_nominal), 0) AS total FROM loans
      WHERE user_id = $1 AND status_denda = 'Tertunggak'`,
    [userId]
  );
  return Number(rows[0].total);
}

/* ===================== MAHASISWA ===================== */

// Mahasiswa mengajukan peminjaman -> status "Menunggu Konfirmasi"
export async function ajukanPinjam(prevState, formData) {
  const user = await requireRole("mahasiswa");
  const bookId = idDariForm(formData);
  if (!bookId) return gagal("ID buku tidak valid.");

  const { rows } = await pool.query(
    "SELECT stok_tersedia FROM books WHERE id = $1",
    [bookId]
  );
  if (rows.length === 0) return gagal("Buku tidak ditemukan.");
  if (rows[0].stok_tersedia <= 0) return gagal("Stok buku sedang habis.");

  // Aturan blokir: masih ada denda Tertunggak -> tidak boleh pinjam baru
  if ((await totalDendaTertunggak(pool, user.id)) > 0) {
    return gagal("Kamu masih punya denda tertunggak. Lunasi dulu sebelum meminjam lagi.");
  }

  try {
    await pool.query(
      "INSERT INTO loans (user_id, book_id) VALUES ($1, $2)",
      [user.id, bookId]
    );
  } catch (err) {
    // unique index uq_loans_aktif_per_buku
    if (err.code === "23505") {
      return gagal("Kamu sudah punya pengajuan atau peminjaman aktif untuk buku ini.");
    }
    throw err;
  }

  segarkan();
  redirect("/dashboard/mahasiswa?status=diajukan");
}

// Mahasiswa mengajukan perpanjangan -> "Perpanjangan Diajukan"
export async function ajukanPerpanjangan(prevState, formData) {
  const user = await requireRole("mahasiswa");
  const id = idDariForm(formData);
  if (!id) return gagal("ID transaksi tidak valid.");

  const { rows } = await pool.query(
    `SELECT status_pinjam, status_perpanjangan
       FROM loans WHERE id = $1 AND user_id = $2`,
    [id, user.id]
  );
  const loan = rows[0];
  if (!loan) return gagal("Transaksi tidak ditemukan.");
  if (loan.status_pinjam !== "Sedang Dipinjam")
    return gagal("Perpanjangan hanya untuk buku yang sedang dipinjam.");
  if (loan.status_perpanjangan === "Perpanjangan Diajukan")
    return gagal("Perpanjangan sedang menunggu persetujuan pegawai.");
  if (loan.status_perpanjangan === "Perpanjangan Disetujui")
    return gagal("Perpanjangan hanya bisa dilakukan satu kali per peminjaman.");

  await pool.query(
    `UPDATE loans SET status_perpanjangan = 'Perpanjangan Diajukan'
      WHERE id = $1 AND user_id = $2`,
    [id, user.id]
  );

  segarkan();
  return berhasil("Perpanjangan diajukan, menunggu persetujuan pegawai.");
}

// Mahasiswa menulis ulasan (hanya untuk transaksi Selesai, satu ulasan per transaksi)
export async function kirimUlasan(prevState, formData) {
  const user = await requireRole("mahasiswa");

  const loanId = idDariForm(formData, "loan_id");
  const values = {
    rating: String(formData.get("rating") ?? "").trim(),
    komentar: String(formData.get("komentar") ?? "").trim(),
  };
  const errors = validateUlasan(values);
  if (!loanId) return { errors, message: "Transaksi tidak valid.", values };
  if (Object.keys(errors).length > 0) return { errors, message: "", values };

  const { rows } = await pool.query(
    "SELECT status_pinjam FROM loans WHERE id = $1 AND user_id = $2",
    [loanId, user.id]
  );
  if (rows.length === 0) return { errors: {}, message: "Transaksi tidak ditemukan.", values };
  if (rows[0].status_pinjam !== "Selesai") {
    return { errors: {}, message: "Ulasan hanya bisa ditulis setelah buku dikembalikan.", values };
  }

  try {
    await pool.query(
      "INSERT INTO reviews (loan_id, rating, komentar) VALUES ($1, $2, $3)",
      [loanId, Number(values.rating), values.komentar || null]
    );
  } catch (err) {
    if (err.code === "23505") {
      return { errors: {}, message: "Kamu sudah mengulas transaksi ini.", values };
    }
    throw err;
  }

  segarkan();
  redirect("/dashboard/mahasiswa?status=ulasan");
}

/* ===================== PEGAWAI & ADMIN ===================== */

// Approve: Menunggu Konfirmasi -> Sedang Dipinjam, stok_tersedia - 1 (transaksi SQL)
export async function setujuiPinjam(prevState, formData) {
  const staf = await requireRole("pegawai");
  const id = idDariForm(formData);
  if (!id) return gagal("ID transaksi tidak valid.");

  const hasil = await dalamTransaksi(async (db) => {
    const { rows } = await db.query(
      `SELECT l.status_pinjam, l.user_id, b.id AS book_id, b.stok_tersedia, b.durasi_maks_pinjam
         FROM loans l JOIN books b ON b.id = l.book_id
        WHERE l.id = $1
          FOR UPDATE OF l, b`,
      [id]
    );
    const row = rows[0];
    if (!row) return gagal("Transaksi tidak ditemukan.");
    if (row.status_pinjam !== "Menunggu Konfirmasi")
      return gagal("Transaksi ini sudah diproses.");
    if (row.stok_tersedia <= 0) return gagal("Stok buku habis, tidak bisa disetujui.");

    // Aturan blokir juga berlaku saat persetujuan: denda bisa saja baru muncul
    // setelah mahasiswa mengajukan (mis. buku lain yang telat baru dikembalikan).
    if ((await totalDendaTertunggak(db, row.user_id)) > 0) {
      return gagal(
        "Tidak bisa disetujui: mahasiswa ini masih punya denda tertunggak. Tolak pengajuan atau minta denda dilunasi dulu."
      );
    }

    await db.query(
      "UPDATE books SET stok_tersedia = stok_tersedia - 1 WHERE id = $1",
      [row.book_id]
    );
    await db.query(
      `UPDATE loans
          SET status_pinjam = 'Sedang Dipinjam',
              tanggal_pinjam = CURRENT_DATE,
              tanggal_jatuh_tempo = CURRENT_DATE + $2::int,
              processed_by = $3
        WHERE id = $1`,
      [id, row.durasi_maks_pinjam, staf.id]
    );
    return berhasil("Peminjaman disetujui.");
  });

  if (hasil.ok) segarkan();
  return hasil;
}

// Reject: Menunggu Konfirmasi -> Ditolak (alasan wajib)
export async function tolakPinjam(prevState, formData) {
  const staf = await requireRole("pegawai");
  const id = idDariForm(formData);
  const alasan = String(formData.get("alasan") ?? "").trim();
  if (!id) return gagal("ID transaksi tidak valid.");
  const pesanAlasan = validateAlasanTolak(alasan);
  if (pesanAlasan) return gagal(pesanAlasan);

  const result = await pool.query(
    `UPDATE loans
        SET status_pinjam = 'Ditolak', alasan_penolakan = $2, processed_by = $3
      WHERE id = $1 AND status_pinjam = 'Menunggu Konfirmasi'`,
    [id, alasan, staf.id]
  );
  if (result.rowCount === 0) return gagal("Transaksi ini sudah diproses.");

  segarkan();
  return berhasil("Pengajuan ditolak.");
}

// Pengembalian: Sedang Dipinjam -> Selesai, stok + 1, denda dihitung di backend
export async function konfirmasiKembali(prevState, formData) {
  const staf = await requireRole("pegawai");
  const id = idDariForm(formData);
  if (!id) return gagal("ID transaksi tidak valid.");

  const hasil = await dalamTransaksi(async (db) => {
    const { rows } = await db.query(
      `SELECT l.status_pinjam, b.id AS book_id, b.denda_per_hari,
              GREATEST(CURRENT_DATE - l.tanggal_jatuh_tempo, 0)::int AS hari_telat
         FROM loans l JOIN books b ON b.id = l.book_id
        WHERE l.id = $1
          FOR UPDATE OF l, b`,
      [id]
    );
    const row = rows[0];
    if (!row) return gagal("Transaksi tidak ditemukan.");
    if (row.status_pinjam !== "Sedang Dipinjam")
      return gagal("Buku ini tidak sedang dipinjam.");

    // runtime calculation: hari terlambat x tarif denda per hari milik buku
    const denda = row.hari_telat * Number(row.denda_per_hari);

    await db.query(
      `UPDATE loans
          SET status_pinjam = 'Selesai',
              tanggal_kembali = CURRENT_DATE,
              denda_nominal = $2,
              status_denda = $3,
              processed_by = $4
        WHERE id = $1`,
      [id, denda, denda > 0 ? "Tertunggak" : "Tidak Ada", staf.id]
    );
    await db.query(
      "UPDATE books SET stok_tersedia = stok_tersedia + 1 WHERE id = $1",
      [row.book_id]
    );

    return berhasil(
      denda > 0
        ? `Buku dikembalikan. Terlambat ${row.hari_telat} hari, denda Rp ${denda.toLocaleString("id-ID")}.`
        : "Buku dikembalikan tepat waktu."
    );
  });

  if (hasil.ok) segarkan();
  return hasil;
}

// Denda: Tertunggak -> Lunas
export async function lunasiDenda(prevState, formData) {
  const staf = await requireRole("pegawai");
  const id = idDariForm(formData);
  if (!id) return gagal("ID transaksi tidak valid.");

  const result = await pool.query(
    `UPDATE loans
        SET status_denda = 'Lunas', tanggal_denda_lunas = CURRENT_DATE, processed_by = $2
      WHERE id = $1 AND status_denda = 'Tertunggak'`,
    [id, staf.id]
  );
  if (result.rowCount === 0) return gagal("Denda ini tidak berstatus tertunggak.");

  segarkan();
  return berhasil("Denda ditandai lunas.");
}

// Perpanjangan disetujui: jatuh tempo bertambah otomatis sebesar durasi maksimal pinjam buku
export async function setujuiPerpanjangan(prevState, formData) {
  const staf = await requireRole("pegawai");
  const id = idDariForm(formData);
  if (!id) return gagal("ID transaksi tidak valid.");

  const result = await pool.query(
    `UPDATE loans l
        SET status_perpanjangan = 'Perpanjangan Disetujui',
            tanggal_jatuh_tempo = l.tanggal_jatuh_tempo + b.durasi_maks_pinjam,
            processed_by = $2
       FROM books b
      WHERE l.id = $1
        AND b.id = l.book_id
        AND l.status_pinjam = 'Sedang Dipinjam'
        AND l.status_perpanjangan = 'Perpanjangan Diajukan'`,
    [id, staf.id]
  );
  if (result.rowCount === 0) return gagal("Tidak ada pengajuan perpanjangan yang menunggu.");

  segarkan();
  return berhasil("Perpanjangan disetujui, jatuh tempo diperbarui.");
}

export async function tolakPerpanjangan(prevState, formData) {
  const staf = await requireRole("pegawai");
  const id = idDariForm(formData);
  if (!id) return gagal("ID transaksi tidak valid.");

  const result = await pool.query(
    `UPDATE loans
        SET status_perpanjangan = 'Perpanjangan Ditolak', processed_by = $2
      WHERE id = $1
        AND status_pinjam = 'Sedang Dipinjam'
        AND status_perpanjangan = 'Perpanjangan Diajukan'`,
    [id, staf.id]
  );
  if (result.rowCount === 0) return gagal("Tidak ada pengajuan perpanjangan yang menunggu.");

  segarkan();
  return berhasil("Perpanjangan ditolak.");
}
