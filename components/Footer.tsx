"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { navLinks, BRAND } from "@/lib/data";

export default function Footer() {
  const pathname = usePathname();
  const t = useTranslations();
  const navT = t.raw("nav") as Record<string, string>;

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full mt-12 py-8 px-4"
      style={{
        background: "var(--card)",
        borderTop: "3px solid var(--border)",
      }}
    >
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">{BRAND.emoji}</span>
          <span
            className="text-xl font-bold"
            style={{
              fontFamily: "'Fredoka One', sans-serif",
              color: "var(--primary)",
            }}
          >
            {BRAND.name}
          </span>
        </div>

        <nav className="flex items-center gap-3 flex-wrap justify-center" aria-label="Footer navigation">
          {navLinks.map((link) => {
            const isAnchor = link.href.startsWith("#");
            const label = navT[link.key] ?? link.label;

            if (isAnchor) {
              return (
                <Link
                  key={link.key}
                  href={pathname === "/" ? link.href : "/" + link.href}
                  onClick={(e) => {
                    if (pathname === "/") {
                      e.preventDefault();
                      document
                        .querySelector(link.href)
                        ?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="text-sm font-semibold transition-colors duration-200 hover:underline focus-visible:outline-none focus-visible:ring-2 rounded"
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {label}
                </Link>
              );
            }

            return (
              <Link
                key={link.key}
                href={link.href}
                className="text-sm font-semibold transition-colors duration-200 hover:underline focus-visible:outline-none focus-visible:ring-2 rounded"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  color: "var(--muted-foreground)",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <p
          className="text-sm"
          style={{
            fontFamily: "'Nunito', sans-serif",
            color: "var(--muted-foreground)",
          }}
        >
          {t("footer.tagline")}
        </p>
      </div>
    </motion.footer>
  );
}