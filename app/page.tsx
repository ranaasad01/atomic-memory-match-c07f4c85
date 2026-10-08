"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";

// ── Types ──────────────────────────────────────────────────────────────────
interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// ── Emoji pool ─────────────────────────────────────────────────────────────
const EMOJI_POOL = ["🦊", "🐬", "🦄", "🌈", "🍕", "🚀"];

function buildDeck(): Card[] {
  const pairs = [...EMOJI_POOL, ...EMOJI_POOL];
  // Fisher-Yates shuffle
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs.map((emoji, idx) => ({
    id: idx,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
}

// ── Card face variants ─────────────────────────────────────────────────────
const cardFront: Variants = {
  hidden: { rotateY: 90, opacity: 0 },
  visible: { rotateY: 0, opacity: 1, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { rotateY: 90, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

const cardBack: Variants = {
  hidden: { rotateY: -90, opacity: 0 },
  visible: { rotateY: 0, opacity: 1, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { rotateY: -90, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

const celebrationVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 18 },
  },
};

const starVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: [0, 1, 0],
    scale: [0, 1.4, 0],
    y: [0, -60 - i * 10],
    x: [(i % 2 === 0 ? 1 : -1) * i * 12],
    transition: { duration: 1.2, delay: i * 0.08, ease: "easeOut" },
  }),
};

// ── Confetti dots ──────────────────────────────────────────────────────────
const CONFETTI_COLORS = [
  "bg-[var(--brand-yellow)]",
  "bg-[var(--brand-pink)]",
  "bg-[var(--brand-blue)]",
  "bg-[var(--brand-green)]",
  "bg-[var(--brand-purple)]",
];

// ── Main component ─────────────────────────────────────────────────────────
export default function MemoryMatchPage() {
  const t = useTranslations();

  const [deck, setDeck] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydration-safe mount
  useEffect(() => {
    setMounted(true);
    setDeck(buildDeck());
  }, []);

  const startNewGame = useCallback(() => {
    setDeck(buildDeck());
    setFlipped([]);
    setMoves(0);
    setLocked(false);
    setWon(false);
  }, []);

  const handleCardClick = useCallback(
    (id: number) => {
      if (locked || won) return;
      const card = deck.find((c) => c.id === id);
      if (!card || card.isFlipped || card.isMatched) return;
      if (flipped.length === 1 && flipped[0] === id) return;

      const newFlipped = [...flipped, id];

      setDeck((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
      );

      if (newFlipped.length === 2) {
        setMoves((m) => m + 1);
        setLocked(true);

        const [firstId, secondId] = newFlipped;
        const first = deck.find((c) => c.id === firstId)!;
        const second = deck.find((c) => c.id === secondId)!;

        if (first.emoji === second.emoji) {
          // Match!
          setDeck((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true, isFlipped: true }
                : c
            )
          );
          setFlipped([]);
          setLocked(false);

          // Check win after state settles
          setTimeout(() => {
            setDeck((prev) => {
              const allMatched = prev.every((c) => c.isMatched);
              if (allMatched) setWon(true);
              return prev;
            });
          }, 100);
        } else {
          // No match — flip back after delay
          setTimeout(() => {
            setDeck((prev) =>
              prev.map((c) =>
                c.id === firstId || c.id === secondId
                  ? { ...c, isFlipped: false }
                  : c
              )
            );
            setFlipped([]);
            setLocked(false);
          }, 900);
        }
      } else {
        setFlipped(newFlipped);
      }
    },
    [deck, flipped, locked, won]
  );

  const matchedCount = deck.filter((c) => c.isMatched).length / 2;

  if (!mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--brand-bg)]">
        <p className="text-4xl animate-bounce">🎴</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--brand-bg)] pb-16">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <Reveal>
        <section className="relative overflow-hidden pt-10 pb-6 px-4 text-center">
          {/* Decorative blobs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[var(--brand-yellow)]/30 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-8 -right-16 w-56 h-56 rounded-full bg-[var(--brand-pink)]/30 blur-3xl"
          />

          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
            className="inline-block text-6xl mb-3 select-none"
            aria-hidden="true"
          >
            🎴
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--brand-heading)] leading-tight text-balance"
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5, ease: "easeOut" }}
            className="mt-3 text-xl md:text-2xl text-[var(--brand-body)] font-medium"
          >
            {t("hero.subtitle")}
          </motion.p>
        </section>
      </Reveal>

      {/* ── Stats bar ────────────────────────────────────────────────── */}
      <Reveal delay={0.05}>
        <section
          id="stats"
          className="mx-auto max-w-lg px-4 mb-6"
          aria-label={t("stats.label")}
        >
          <div className="flex items-center justify-between gap-4 bg-white rounded-3xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.10)] border border-black/5 px-6 py-4">
            {/* Moves */}
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-3xl font-extrabold text-[var(--brand-purple)]">
                {moves}
              </span>
              <span className="text-sm font-semibold text-[var(--brand-body)] uppercase tracking-wide">
                {t("stats.moves")}
              </span>
            </div>

            {/* Pairs found */}
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-3xl font-extrabold text-[var(--brand-green)]">
                {matchedCount} / {EMOJI_POOL.length}
              </span>
              <span className="text-sm font-semibold text-[var(--brand-body)] uppercase tracking-wide">
                {t("stats.pairs")}
              </span>
            </div>

            {/* New game button */}
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              onClick={startNewGame}
              className="bg-[var(--brand-purple)] text-white font-extrabold text-base rounded-2xl px-5 py-3 shadow-[0_4px_14px_-2px_rgba(139,92,246,0.45)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--brand-purple)]/50"
              aria-label={t("stats.newGame")}
            >
              {t("stats.newGame")}
            </motion.button>
          </div>
        </section>
      </Reveal>

      {/* ── Game board ───────────────────────────────────────────────── */}
      <Reveal delay={0.1}>
        <section
          id="game-board"
          className="mx-auto max-w-2xl px-4"
          aria-label={t("board.label")}
        >
          <div
            className="grid gap-3 sm:gap-4"
            style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
            role="list"
          >
            {deck.map((card, i) => (
              <motion.div
                key={card.id}
                role="listitem"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, duration: 0.35, ease: "easeOut" }}
                className="aspect-square"
              >
                <motion.button
                  onClick={() => handleCardClick(card.id)}
                  whileHover={
                    !card.isFlipped && !card.isMatched
                      ? { scale: 1.08, rotate: 2 }
                      : {}
                  }
                  whileTap={
                    !card.isFlipped && !card.isMatched ? { scale: 0.93 } : {}
                  }
                  disabled={card.isFlipped || card.isMatched || locked || won}
                  aria-label={
                    card.isFlipped || card.isMatched
                      ? `${t("board.cardRevealed")} ${card.emoji}`
                      : t("board.cardHidden")
                  }
                  className={[
                    "relative w-full h-full rounded-3xl transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--brand-purple)]/60",
                    "shadow-[0_4px_16px_-4px_rgba(0,0,0,0.13)]",
                    card.isMatched
                      ? "cursor-default"
                      : card.isFlipped
                      ? "cursor-default"
                      : "cursor-pointer",
                  ].join(" ")}
                  style={{ perspective: 600 }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {card.isFlipped || card.isMatched ? (
                      <motion.span
                        key="front"
                        variants={cardFront}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={[
                          "absolute inset-0 flex items-center justify-center rounded-3xl text-4xl sm:text-5xl select-none",
                          card.isMatched
                            ? "bg-[var(--brand-green)]/20 border-2 border-[var(--brand-green)]/40"
                            : "bg-white border-2 border-[var(--brand-purple)]/20",
                        ].join(" ")}
                        aria-hidden="true"
                      >
                        {card.emoji}
                        {card.isMatched && (
                          <span className="absolute top-1 right-1 text-xs">✅</span>
                        )}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="back"
                        variants={cardBack}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute inset-0 flex items-center justify-center rounded-3xl text-3xl sm:text-4xl select-none bg-gradient-to-br from-[var(--brand-purple)] to-[var(--brand-blue)] border-2 border-white/20"
                        aria-hidden="true"
                      >
                        🌟
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── How to play ──────────────────────────────────────────────── */}
      <Reveal delay={0.05}>
        <section
          id="how-to-play"
          className="mx-auto max-w-2xl px-4 mt-12"
          aria-labelledby="how-heading"
        >
          <h2
            id="how-heading"
            className="text-3xl font-extrabold text-center text-[var(--brand-heading)] mb-6"
          >
            {t("howTo.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(
              Array.isArray(t.raw("howTo.steps"))
                ? (t.raw("howTo.steps") as { emoji: string; title: string; desc: string }[])
                : []
            ).map((step, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4, scale: 1.03 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.09)] border border-black/5 flex flex-col items-center text-center gap-2"
              >
                <span className="text-4xl" aria-hidden="true">
                  {step.emoji}
                </span>
                <h3 className="font-extrabold text-lg text-[var(--brand-heading)]">
                  {step.title}
                </h3>
                <p className="text-[var(--brand-body)] text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── Fun facts ────────────────────────────────────────────────── */}
      <Reveal delay={0.05}>
        <section
          className="mx-auto max-w-2xl px-4 mt-12"
          aria-labelledby="facts-heading"
        >
          <h2
            id="facts-heading"
            className="text-3xl font-extrabold text-center text-[var(--brand-heading)] mb-6"
          >
            {t("facts.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(
              Array.isArray(t.raw("facts.items"))
                ? (t.raw("facts.items") as { emoji: string; text: string }[])
                : []
            ).map((fact, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.18 }}
                className="flex items-start gap-3 bg-white rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.09)] border border-black/5"
              >
                <span className="text-3xl shrink-0" aria-hidden="true">
                  {fact.emoji}
                </span>
                <p className="text-[var(--brand-body)] text-base leading-relaxed font-medium">
                  {fact.text}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── Emojis key ───────────────────────────────────────────────── */}
      <Reveal delay={0.05}>
        <section
          className="mx-auto max-w-2xl px-4 mt-12"
          aria-labelledby="emojis-heading"
        >
          <h2
            id="emojis-heading"
            className="text-3xl font-extrabold text-center text-[var(--brand-heading)] mb-4"
          >
            {t("emojis.title")}
          </h2>
          <p className="text-center text-[var(--brand-body)] mb-6 text-base">
            {t("emojis.subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {EMOJI_POOL.map((emoji, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.2, rotate: 8 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 14 }}
                className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white shadow-[0_4px_16px_-4px_rgba(0,0,0,0.12)] border border-black/5 text-3xl select-none cursor-default"
                aria-label={emoji}
              >
                {emoji}
              </motion.div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── Win celebration overlay ───────────────────────────────────── */}
      <AnimatePresence>
        {won && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="win-heading"
          >
            {/* Confetti dots */}
            {Array.from({ length: 18 }).map((_, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={starVariants}
                initial="hidden"
                animate="visible"
                className={[
                  "absolute w-3 h-3 rounded-full",
                  CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                ].join(" ")}
                style={{
                  left: `${10 + (i * 5) % 80}%`,
                  top: `${20 + (i * 7) % 50}%`,
                }}
                aria-hidden="true"
              />
            ))}

            <motion.div
              variants={celebrationVariants}
              initial="hidden"
              animate="visible"
              className="relative bg-white rounded-[2rem] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)] border border-black/5 p-8 sm:p-12 max-w-sm w-full text-center"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -8, 8, 0] }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-7xl mb-4 select-none"
                aria-hidden="true"
              >
                🎉
              </motion.div>

              <h2
                id="win-heading"
                className="text-4xl font-extrabold text-[var(--brand-heading)] mb-2 text-balance"
              >
                {t("win.title")}
              </h2>

              <p className="text-[var(--brand-body)] text-lg mb-2">
                {t("win.subtitle")}
              </p>

              <p className="text-[var(--brand-purple)] font-extrabold text-2xl mb-6">
                {moves} {moves === 1 ? t("win.move") : t("win.moves")}
              </p>

              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={startNewGame}
                className="w-full bg-[var(--brand-purple)] text-white font-extrabold text-xl rounded-2xl py-4 shadow-[0_6px_20px_-4px_rgba(139,92,246,0.5)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--brand-purple)]/50"
              >
                {t("win.playAgain")}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}