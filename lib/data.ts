export interface NavLink {
  label: string;
  href: string;
  key: string;
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "/", key: "home" },
  { label: "How to Play", href: "#game-board", key: "howtoplay" },
  { label: "Stats", href: "#stats", key: "stats" },
];

export const APP_NAME = "Memory Match";
export const APP_TAGLINE = "Can you find all the matching pairs?";

export const BRAND = {
  name: APP_NAME,
  tagline: APP_TAGLINE,
  emoji: "🧠",
} as const;