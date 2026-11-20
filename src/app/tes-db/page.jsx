import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TesDbPage() {
  const { rows } = await pool.query("SELECT COUNT(*) AS jumlah FROM books");
  return <p>Jumlah buku di database: {rows[0].jumlah}</p>;
}