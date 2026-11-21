import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import CoverImage from "@/components/CoverImage";

/**
 * Mendukung dua pola lama pemanggilan:
 * <BookCard book={book} /> dan <BookCard {...book} />.
 */
export default function BookCard({ book: bookProp, badge, ...bookFields }) {
  const book =
    bookProp && typeof bookProp === "object" && !Array.isArray(bookProp)
      ? bookProp
      : bookFields;

  const title = book.title ?? book.judul ?? "Judul Buku";
  const author =
    book.author ?? book.penulis ?? book.pengarang ?? "Penulis belum tersedia";
  const category = book.category ?? book.kategori ?? "Kategori belum tersedia";
  const stock = book.stock ?? book.stok_tersedia ?? book.stok_total ?? "—";
  const status = badge ?? book.status ?? (Number(stock) > 0 ? "Tersedia" : "Stok habis");
  const cover = book.cover_url ?? book.cover ?? null;
  const rating = book.rating;
  const href = typeof book.href === "string" && book.href.length > 0 ? book.href : "#";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/60 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80">
      <div className="relative aspect-[4/3] min-h-52 overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-5 text-white">
        <CoverImage src={cover} alt={`Sampul ${title}`} />
        <div className="relative flex h-full flex-col justify-between gap-4">
          <StatusBadge status={status} />
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/75">
              RakBaca
            </p>
            <h3 className="mt-2 min-h-[3.25rem] line-clamp-2 break-words text-xl font-black leading-tight tracking-tight text-white sm:text-2xl">
              {title}
            </h3>
            <p className="mt-1 line-clamp-1 text-sm text-white/85">{author}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="line-clamp-1 text-sm text-slate-600">{category}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Stok tersedia</p>
            <p className="text-base font-semibold text-slate-900">{stock}</p>
            {rating !== undefined && rating !== null ? (
              <p className="mt-1 text-xs font-medium text-amber-600">★ {rating}</p>
            ) : null}
          </div>
          <Link
            href={href}
            className="shrink-0 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold !text-white transition hover:bg-blue-700"
          >
            Detail
          </Link>
        </div>
      </div>
    </article>
  );
}
