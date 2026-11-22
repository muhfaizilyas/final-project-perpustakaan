import AppFrame from "@/components/AppFrame";
import { KatalogPanel, PengumumanPanel } from "@/components/SectionPanels";

// Untuk halaman yang boleh dibuka siapa saja (detail buku, pengumuman).
// section = "katalog" atau "pengumuman"; user null berarti Guest.
// aktif = penanda item aktif di panel kiri (lihat SectionPanels).
export default function PageShell({ user, section = "katalog", aktif, title, subtitle, actions, children }) {
  const panel =
    section === "pengumuman" ? (
      <PengumumanPanel user={user} aktif={aktif} />
    ) : (
      <KatalogPanel aktif={aktif} />
    );
  return (
    <AppFrame user={user} section={section} panel={panel} title={title} subtitle={subtitle} actions={actions}>
      {children}
    </AppFrame>
  );
}
