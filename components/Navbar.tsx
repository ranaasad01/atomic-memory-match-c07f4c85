"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { navLinks } from "@/lib/data";
import { BRAND } from "@/lib/data";

export default function Navbar() {
  const pathname = usePathname();
  const t = useTranslations();
  const navT = t.raw("nav") as Record<string, string>;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full"
      style={{
        background: "var(--card)",
        borderBottom: "3px solid var(--border)",
        boxShadow: "0 4px 16px rgba(77, 150, 255, 0.10)",
      }}
    >
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.span
            className="text-3xl"
            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.15 }}
            transition={{ duration: 0.5 }}
            aria-hidden="true"
          >
            {BRAND.emoji}
          </motion.span>
          <span
            className="text-2xl font-bold tracking-tight"
            style={{
              fontFamily: "'Fredoka One', sans-serif",
              color: "var(--primary)",
            }}
          >
            {BRAND.name}
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isAnchor = link.href.startsWith("#");
            const label = navT[link.key] ?? link.label;

            if (isAnchor) {
              return (
                <motion.div key={link.key} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={pathname === "/" ? link.href : "/" + link.href}
                    onClick={(e) => {
                      if (pathname === "/") {
                        e.preventDefault();
                        document
                          .querySelector(link.href)
                          ?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2"
                    style={{
                      fontFamily: "'Nunito', sans-serif",
                      color: "var(--foreground)",
                      background: "var(--background)",
                      border: "2px solid var(--border)",
                    }}
                  >
                    {label}
                  </Link>
                </motion.div>
              );
            }

            return (
              <motion.div key={link.key} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={link.href}
                  className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2"
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    color: "var(--foreground)",
                    background: "var(--background)",
                    border: "2px solid var(--border)",
                  }}
                >
                  {label}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}