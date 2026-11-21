import Link from "next/link";
import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { formatTanggal, formatRupiah } from "@/lib/format";
import DashboardShell from "@/components/DashboardShell";
import MetricCard from "@/components/MetricCard";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";

export const metadata = { title: "Dashboard Mahasiswa" };

export default async function MahasiswaDashboardPage() {
  const user = await requireRole("mahasiswa");

  const [ringkasan, dipinjam, aktivitas] = await Promise.all([
    pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE status_pinjam = 'Sedang Dipinjam')::int      AS dipinjam,
         COUNT(*) FILTER (WHERE status_pinjam = 'Menunggu Konfirmasi')::int  AS menunggu,
         COUNT(*) FILTER (WHERE status_pinjam = 'Selesai')::int              AS selesai,
         COALESCE(SUM(denda_nominal) FILTER (WHERE status_denda = 'Tertunggak'), 0) AS denda
       FROM loans WHERE user_id = $1`,
      [user.id]
    ),
    pool.query(
      `SELECT l.id, b.judul, b.pengarang, c.nama AS kategori,
              l.tanggal_jatuh_tempo::text AS jatuh_tempo,
              (l.tanggal_jatuh_tempo - CURRENT_DATE)::int AS sisa_hari,
              l.status_perpanjangan
         FROM loans l
         JOIN books b ON b.id = l.book_id
         JOIN categories c ON c.id = b.category_id
        WHERE l.user_id = $1 AND l.status_pinjam = 'Sedang Dipinjam'
        ORDER BY l.tanggal_jatuh_tempo`,
      [user.id]
    ),
    pool.query(
      `SELECT l.id, b.judul, l.status_pinjam, l.tanggal_pengajuan::date::text AS tanggal
         FROM loans l JOIN books b ON b.id = l.book_id
        WHERE l.user_id = $1
        ORDER BY l.tanggal_pengajuan DESC, l.id DESC
        LIMIT 5`,
      [user.id]
    ),
  ]);
  const r = ringkasan.rows[0];
  const diblokir = Number(r.denda) > 0;

  const stats = [
    { label: "Sedang Dipinjam", value: r.dipinjam, note: "Buku yang kamu pegang", tone: "sky" },
    { label: "Menunggu Konfirmasi", value: r.menunggu, note: "Pengajuan belum diproses", tone: "amber" },
    { label: "Riwayat Selesai", value: r.selesai, note: "Peminjaman yang sudah kembali", tone: "emerald" },
    { label: "Denda Tertunggak", value: formatRupiah(r.denda), note: diblokir ? "Harus dilunasi" : "Tidak ada tanggungan", tone: "rose" },
  ];

  return (
    <DashboardShell
      user={user}
      title="Dashboard Mahasiswa"
      subtitle="Pantau buku yang dipinjam, jatuh tempo, dan denda."
      actions={
        <Link href="/katalog" className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold !text-white transition hover:bg-slate-800">
          Jelajahi Buku
        </Link>
      }
    >
      <div className="space-y-8">
        {diblokir ? (
          <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            Kamu punya denda tertunggak sebesar <strong>{formatRupiah(r.denda)}</strong>.
            Pengajuan pinjam baru tidak dapat dilakukan sampai denda dilunasi.
          </p>
        ) : null}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => <MetricCard key={item.label} {...item} />)}
        </section>

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Buku Sedang Dipinjam</h2>
              <p className="mt-1 text-sm text-slate-500">Urut dari jatuh tempo terdekat.</p>
            </div>
            {dipinjam.rows.length === 0 ? (
              <EmptyState
                title="Belum ada buku yang dipinjam"
                description="Cari buku di katalog, lalu ajukan peminjaman."
                action={<Link href="/katalog" className="rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-semibold !text-white transition hover:bg-sky-700">Buka katalog</Link>}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {dipinjam.rows.map((b) => (
                  <article key={b.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700">{b.kategori}</p>
                    <h3 className="mt-2 text-base font-bold text-slate-900">{b.judul}</h3>
                    <p className="text-sm text-slate-500">{b.pengarang}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <StatusBadge tone={b.sisa_hari < 0 ? "danger" : b.sisa_hari <= 2 ? "warning" : "info"}>
                        {b.sisa_hari < 0
                          ? `Terlambat ${Math.abs(b.sisa_hari)} hari`
                          : b.sisa_hari === 0
                            ? "Jatuh tempo hari ini"
                            : `${b.sisa_hari} hari lagi`}
                      </StatusBadge>
                      {b.status_perpanjangan ? <StatusBadge status={b.status_perpanjangan} /> : null}
                    </div>
                    <p className="mt-3 text-xs text-slate-500">Jatuh tempo {formatTanggal(b.jatuh_tempo)}</p>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Aktivitas Terakhir</h2>
            <p className="mt-1 text-sm text-slate-500">Lima pengajuan terbaru kamu.</p>
            <div className="mt-6 space-y-3">
              {aktivitas.rows.length === 0 ? (
                <p className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">Belum ada aktivitas.</p>
              ) : (
                aktivitas.rows.map((l) => (
                  <div key={l.id} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">{l.judul}</p>
                      <p className="text-sm text-slate-500">{formatTanggal(l.tanggal)}</p>
                    </div>
                    <StatusBadge status={l.status_pinjam} />
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
