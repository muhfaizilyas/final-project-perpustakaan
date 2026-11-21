import "./globals.css";

export const metadata = {
  title: "Perpustakaan Kampus",
  description: "Sistem manajemen perpustakaan kampus",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
