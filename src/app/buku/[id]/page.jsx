import Link from "next/link";
import { notFound } from "next/navigation";
import pool from "@/lib/db";
import { parseId } from "@/lib/id";
import { getCurrentUser } from "@/lib/auth";
import { formatTanggal, formatRupiah } from "@/lib/format";
import PageShell from "@/components/PageShell";
import StatusBadge from "@/components/StatusBadge";
import CoverImage from "@/components/CoverImage";
import EmptyState from "@/components/EmptyState";
import AksiForm from "@/components/AksiForm";
import { ajukanPinjam } from "@/actions/loan";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const bukuId = parseId(id);
  if (!bukuId) return { title: "Buku tidak ditemukan" };
  const { rows } = await pool.query("SELECT judul FROM books WHERE id = $1", [bukuId]);
  return { title: rows[0]?.judul ?? "Buku tidak ditemukan" };
}

export default async function DetailBukuPage({ params }) {
  const { id } = await params;
  const bukuId = parseId(id);
  if (!bukuId) notFound();

  const user = await getCurrentUser();

  const [buku, ulasan] = await Promise.all([
    pool.query(
      `SELECT b.id, b.judul, b.isbn, b.pengarang, b.penerbit, b.tahun_terbit,
              b.stok_total, b.stok_tersedia, b.durasi_maks_pinjam, b.denda_per_hari, b.cover_url,
              c.nama AS kategori
         FROM books b JOIN categories c ON c.id = b.category_id
        WHERE b.id = $1`,
      [bukuId]
    ),
    pool.query(
      `SELECT r.id, r.rating, r.komentar, r.created_at::date::text AS tanggal, u.nama_lengkap
         FROM reviews r
         JOIN loans l ON l.id = r.loan_id
         JOIN users u ON u.id = l.user_id
        WHERE l.book_id = $1
        ORDER BY r.created_at DESC`,
      [bukuId]
    ),
  ]);
  if (buku.rows.length === 0) notFound();

  const b = buku.rows[0];
  const reviews = ulasan.rows;
  const rataRata = reviews.length
    ? (reviews.reduce((jumlah, r) => jumlah + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  // Status khusus mahasiswa: diblokir denda? sudah punya pengajuan/pinjaman aktif untuk buku ini?
  let status = { diblokir: false, aktif: false };
  if (user?.role === "mahasiswa") {
    const { rows } = await pool.query(
      `SELECT
         EXISTS (SELECT 1 FROM loans WHERE user_id = $1 AND status_denda = 'Tertunggak') AS diblokir,
         EXISTS (SELECT 1 FROM loans WHERE user_id = $1 AND book_id = $2
                  AND status_pinjam IN ('Menunggu Konfirmasi', 'Sedang Dipinjam')) AS aktif`,
      [user.id, bukuId]
    );
    status = rows[0];
  }

  const info = [
    ["ISBN", b.isbn],
    ["Pengarang", b.pengarang],
    ["Penerbit", b.penerbit],
    ["Tahun terbit", b.tahun_terbit],
    ["Kategori", b.kategori],
    ["Durasi maks. pinjam", `${b.durasi_maks_pinjam} hari`],
    ["Denda per hari", formatRupiah(b.denda_per_hari)],
  ];

  return (
    <PageShell user={user} title="Detail Buku" subtitle="Informasi lengkap, ketersediaan, dan ulasan pembaca.">
      <div className="space-y-8">
        <Link href="/katalog" className="text-sm font-semibold text-sky-600 hover:text-sky-700">
          &larr; Kembali ke katalog
        </Link>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative flex min-h-64 flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-6 text-white shadow-sm">
            <CoverImage src={b.cover_url} alt={`Sampul ${b.judul}`} />
            <div className="relative"><StatusBadge status={b.stok_tersedia > 0 ? "Tersedia" : "Stok habis"} /></div>
            <div className="relative">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/75">RakBaca</p>
              <h2 className="mt-2 break-words text-2xl font-black leading-tight">{b.judul}</h2>
              <p className="mt-1 text-sm text-white/85">{b.pengarang}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone={b.stok_tersedia > 0 ? "success" : "danger"}>
                Stok tersedia {b.stok_tersedia} dari {b.stok_total}
              </StatusBadge>
              {rataRata ? (
                <span className="text-sm font-semibold text-amber-600">★ {rataRata} ({reviews.length} ulasan)</span>
              ) : (
                <span className="text-sm text-slate-500">Belum ada ulasan</span>
              )}
            </div>
            <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {info.map(([label, nilai]) => (
                <div key={label}>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</dt>
                  <dd className="mt-1 text-sm font-medium text-slate-900">{nilai}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 border-t border-slate-100 pt-5">
              {!user ? (
                <p className="text-sm text-slate-600">
                  <Link href="/login" className="font-semibold text-sky-600 hover:text-sky-700">Masuk</Link> atau{" "}
                  <Link href="/register" className="font-semibold text-sky-600 hover:text-sky-700">daftar sebagai mahasiswa</Link>{" "}
                  untuk mengajukan peminjaman.
                </p>
              ) : user.role !== "mahasiswa" ? (
                <p className="text-sm text-slate-500">Peminjaman hanya tersedia untuk akun mahasiswa.</p>
              ) : status.diblokir ? (
                <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                  Pengajuan pinjam diblokir karena kamu masih punya denda tertunggak.
                </p>
              ) : status.aktif ? (
                <p className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
                  Kamu sudah punya pengajuan atau peminjaman aktif untuk buku ini.{" "}
                  <Link href="/dashboard/mahasiswa" className="font-semibold underline">Lihat dashboard</Link>
                </p>
              ) : b.stok_tersedia <= 0 ? (
                <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Stok sedang habis, belum bisa dipinjam.
                </p>
              ) : (
                <AksiForm action={ajukanPinjam} id={b.id} label="Ajukan Pinjam" variant="dark" large />
              )}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">Ulasan Pembaca</h2>
          <div className="mt-4 space-y-3">
            {reviews.length === 0 ? (
              <EmptyState title="Belum ada ulasan" description="Ulasan muncul setelah mahasiswa menyelesaikan peminjaman buku ini." />
            ) : (
              reviews.map((r) => (
                <article key={r.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900">{r.nama_lengkap}</p>
                    <p className="text-sm font-semibold text-amber-600" aria-label={`Rating ${r.rating} dari 5`}>
                      {"★".repeat(r.rating)}
                      <span className="text-slate-300">{"★".repeat(5 - r.rating)}</span>
                    </p>
                  </div>
                  {r.komentar ? <p className="mt-2 text-sm leading-6 text-slate-600">{r.komentar}</p> : null}
                  <p className="mt-3 text-xs text-slate-500">{formatTanggal(r.tanggal)}</p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
