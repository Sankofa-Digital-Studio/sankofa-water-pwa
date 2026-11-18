import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      /* ── Brand Colour Palette ─────────────────────────── */
      colors: {
        // Deep dark backgrounds (matches existing design)
        slate: {
          950: "#020617",
          900: "#0f172a",
          800: "#1e293b",
          700: "#334155",
          600: "#475569",
          500: "#64748b",
          400: "#94a3b8",
          300: "#cbd5e1",
          200: "#e2e8f0",
          100: "#f1f5f9",
          50:  "#f8fafc",
        },
        // Water / IoT primary – cyan
        cyan: {
          950: "#083344",
          900: "#164e63",
          800: "#155e75",
          700: "#0e7490",
          600: "#0891b2",
          500: "#06b6d4",
          400: "#22d3ee",
          300: "#67e8f9",
          200: "#a5f3fc",
          100: "#cffafe",
          50:  "#ecfeff",
        },
        // Alerts / warnings – amber
        amber: {
          950: "#451a03",
          900: "#78350f",
          800: "#92400e",
          700: "#b45309",
          600: "#d97706",
          500: "#f59e0b",
          400: "#fbbf24",
          300: "#fcd34d",
          200: "#fde68a",
          100: "#fef3c7",
          50:  "#fffbeb",
        },
        // Success / healthy readings – emerald
        emerald: {
          950: "#022c22",
          900: "#064e3b",
          800: "#065f46",
          700: "#047857",
          600: "#059669",
          500: "#10b981",
          400: "#34d399",
          300: "#6ee7b7",
          200: "#a7f3d0",
          100: "#d1fae5",
          50:  "#ecfdf5",
        },
        // Errors / critical alerts – rose
        rose: {
          950: "#4c0519",
          900: "#881337",
          800: "#9f1239",
          700: "#be123c",
          600: "#e11d48",
          500: "#f43f5e",
          400: "#fb7185",
          300: "#fda4af",
          200: "#fecdd3",
          100: "#ffe4e6",
          50:  "#fff1f2",
        },
      },

      /* ── Typography ───────────────────────────────────── */
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },

      /* ── Spacing / Sizing ─────────────────────────────── */
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },

      /* ── Border Radius ────────────────────────────────── */
      borderRadius: {
        "4xl": "2rem",
      },

      /* ── Box Shadow ───────────────────────────────────── */
      boxShadow: {
        glow: "0 0 20px rgba(6, 182, 212, 0.35)",      // cyan glow for active sensors
        "glow-amber": "0 0 20px rgba(245, 158, 11, 0.35)",
        "glow-rose": "0 0 20px rgba(244, 63, 94, 0.35)",
      },

      /* ── Animation ────────────────────────────────────── */
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "fade-in": "fade-in 0.3s ease-out both",
        "slide-in-right": "slide-in-right 0.25s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
