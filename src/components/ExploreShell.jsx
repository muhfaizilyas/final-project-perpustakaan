import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { dashboardPath } from "@/lib/auth";

const IKON = {
  book: "M2 4q5-2 10 2 5-4 10-2v15q-5-2-10 2-5-4-10-2zM12 6v15",
  search: "M16.5 10a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0zM15 15l6 6",
  compass: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM16 8l-2.7 5.3L8 16l2.7-5.3z",
  home: "M3 11l9-8 9 8M5 10v10h14V10",
  bell: "M6 17V11a6 6 0 1 1 12 0v6l2 2H4zM10 21h4",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
};

export function Ikon({ nama }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] shrink-0 fill-none stroke-current"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={IKON[nama]} />
    </svg>
  );
}

function NavItem({ href, ikon, label, aktif = false }) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={aktif ? "page" : undefined}
      className={`flex shrink-0 items-center gap-2.5 rounded-[7px] p-2 text-[13px] min-[641px]:mb-1 min-[641px]:w-full min-[641px]:justify-center min-[641px]:p-3 min-[851px]:justify-start ${
        aktif ? "bg-[#e8efff] font-semibold text-[#2453bd]" : "text-[#182339] hover:bg-[#f4f5f9]"
      }`}
    >
      <Ikon nama={ikon} />
      <span className="min-[641px]:hidden min-[851px]:inline">{label}</span>
    </Link>
  );
}

// Kerangka halaman Jelajahi: header + menu kiri + konten + panel detail kanan.
// user = null berarti Guest. search = { q, kategori, sort } untuk kotak cari.
export default function ExploreShell({ user = null, search = {}, children, aside }) {
  const inisial = user
    ? user.nama_lengkap.split(" ").slice(0, 2).map((s) => s[0]).join("").toUpperCase()
    : "";

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-[#182339]">
      <header className="sticky top-0 z-40 flex h-[59px] items-center gap-2 border-b border-[#e3e6ed] bg-white px-3 sm:h-[68px] sm:gap-6 sm:px-6">
        <Link href="/" aria-label="RakBaca" className="flex min-w-0 items-center gap-2 text-[19px] font-extrabold tracking-tight sm:min-w-[140px] sm:text-[22px]">
          <span className="grid place-items-center rounded-[9px] bg-[#275add] p-1.5 text-white">
            <Ikon nama="book" />
          </span>
          RakBaca
        </Link>

        <form method="GET" action="/katalog" role="search" className="flex w-full min-w-0 max-w-[390px] items-center gap-2.5 rounded-lg bg-[#f4f5f9] px-3 py-2 focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-[#5789ed] sm:w-[48%]">
          {search.kategori ? <input type="hidden" name="kategori" value={search.kategori} /> : null}
          {search.sort && search.sort !== "judul" ? <input type="hidden" name="sort" value={search.sort} /> : null}
          <button type="submit" aria-label="Cari" className="text-[#182339]">
            <Ikon nama="search" />
          </button>
          <input
            type="search"
            name="q"
            defaultValue={search.q ?? ""}
            aria-label="Cari judul, pengarang, atau kategori"
            placeholder="Cari judul atau penulis..."
            className="w-full min-w-0 bg-transparent text-sm outline-none"
          />
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {user ? (
            <>
              <Link
                href={dashboardPath(user.role)}
                aria-label="Buka dashboard"
                title="Buka dashboard"
                className="grid h-9 w-9 place-items-center rounded-full bg-[#e4ecff] text-[11px] font-bold text-[#284fac] sm:text-sm"
              >
                {inisial}
              </Link>
              <div className="hidden sm:block"><LogoutButton /></div>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#182339] hover:bg-[#f4f5f9]">Masuk</Link>
              <Link href="/register" className="hidden rounded-lg bg-[#275add] px-3 py-2 text-sm font-semibold !text-white hover:bg-[#2453bd] sm:block">Daftar</Link>
            </>
          )}
        </div>
      </header>

      <div className="flex flex-col min-[641px]:grid min-[641px]:min-h-[calc(100vh-68px)] min-[641px]:grid-cols-[64px_minmax(0,1fr)_210px] min-[851px]:grid-cols-[168px_minmax(0,1fr)_minmax(210px,23%)]">
        <nav
          aria-label="Menu utama"
          className="flex gap-1 overflow-x-auto border-b border-[#e5e8ee] bg-white px-2.5 py-1.5 min-[641px]:block min-[641px]:overflow-visible min-[641px]:border-b-0 min-[641px]:border-r min-[641px]:px-2 min-[641px]:py-[30px] min-[851px]:px-[13px]"
        >
          <p className="mx-2.5 mb-3 hidden text-[10px] font-bold uppercase tracking-[1.7px] text-[#69758b] min-[851px]:block">
            Perpustakaan
          </p>
          <NavItem href="/katalog" ikon="compass" label="Jelajahi" aktif />
          <NavItem href="/" ikon="home" label="Beranda" />
          <NavItem href="/pengumuman" ikon="bell" label="Pengumuman" />
          {user ? <NavItem href={dashboardPath(user.role)} ikon="grid" label="Dashboard" /> : null}
        </nav>

        <main className="min-w-0 px-3.5 py-5 min-[641px]:px-[clamp(16px,2.5vw,34px)] min-[641px]:py-[30px]">
          {children}
        </main>

        <aside aria-label="Detail buku" id="detail" className="bg-[#11274a] text-white">
          <div className="px-5 py-5 text-center min-[641px]:sticky min-[641px]:top-[68px] min-[641px]:max-h-[calc(100vh-68px)] min-[641px]:overflow-y-auto min-[641px]:py-[30px]">
            {aside}
          </div>
        </aside>
      </div>
    </div>
  );
}
