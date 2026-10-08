# AGENTS.md

Project conventions for AI agents and humans editing this codebase.

## Original request
Build a single-page memory card game called "Memory Match" for kids aged 6–10. Show 12 cards (6 emoji pairs) face down in a grid; cards flip when clicked, matches stay face up and mismatches flip back after a moment. Include a move counter, a "New game" button and a celebration message when all pairs are found. Bright, rounded, playful design with big cards and colours. No login, no forms and no external links.

## Goal
Build a single-page, fully client-side Memory Match emoji card game for kids aged 6–10 with flip animations, match detection, move counter, and win celebration.

## Project type
other

## Design system — match this exactly
- Color tokens: `--background: #FFF8F0`, `--foreground: #1A1A2E`, `--card: #FFFFFF`, `--border: #FFD93D`, `--muted-foreground: #6B5E4E`, `--primary: #FF6B6B`, `--accent: #4D96FF`, `--primary-hover: #ff5252`, `--accent-hover: #2d7de0`

## Existing components — reuse these, don't create near-duplicates
- Footer (components/Footer.tsx)
- LanguageToggle (components/LanguageToggle.tsx)
- LocaleProvider (components/LocaleProvider.tsx)
- Navbar (components/Navbar.tsx)

## Existing i18n namespaces
Every translation key must be namespaced (`hero.title`, never a bare `title`) so two components never collide on the same catalog slot. Reuse one of these, or pick a new, distinct name:
`board`, `celebration`, `emojis`, `facts`, `footer`, `header`, `hero`, `howTo`, `nav`, `new-game-button`, `stats`, `win`

When editing or adding pages: preserve the design system above, reuse existing components and the shared nav data file, and keep the established structure and tone.
