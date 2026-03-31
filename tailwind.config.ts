import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base:    "#0F1117",
        surface: "#131720",
        sidebar: "#0C0E17",
        dark: {
          border:  "#1E2535",
          primary: "#4F46E5",
          plight:  "#1e1b4b",
          text:    "#E2E8F0",
          muted:   "#64748B",
          sub:     "#475569",
          green:   "#34d399",
          red:     "#f87171",
          indigo:  "#a5b4fc",
        }
      }
    }
  },
  plugins: [],
};

export default config;