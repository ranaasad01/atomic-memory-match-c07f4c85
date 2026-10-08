import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LocaleProvider from "@/components/LocaleProvider";
import LanguageToggle from "@/components/LanguageToggle";

export const metadata: Metadata = {
  formatDetection: { telephone: false, date: false, email: false, address: false },
  title: "Memory Match — Find All the Pairs!",
  description: "A fun memory card matching game for kids aged 6–10. Flip emoji cards, find matching pairs, and celebrate your win!",
  openGraph: {
    title: "Memory Match — Find All the Pairs!",
    description: "A fun memory card matching game for kids aged 6–10. Flip emoji cards, find matching pairs, and celebrate your win!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="#"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen" style={{ background: "var(--background)" }}>
        <LocaleProvider>
          <LanguageToggle />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}