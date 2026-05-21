import type { Metadata } from "next";
// Kita import font Plus Jakarta Sans dari Google Fonts bawaan Next.js
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Mengatur konfigurasi font
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // Kita ambil ketebalan yang dibutuhkan
});

export const metadata: Metadata = {
  title: "StreamDesk Workspace",
  description: "Manajemen desain live streaming",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Memasukkan class font ke dalam tag body agar berlaku untuk semua halaman */}
      <body className={jakarta.className}>
        {children}
      </body>
    </html>
  );
}