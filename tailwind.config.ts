import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      colors: {
        // Techno-African palette - valeurs arbitraires uniquement
        'vert-principal': '#00873E',
        'or-accent': '#FBBF24',
        'rouge': '#DC2626',
        'fond-primaire': '#0A0A0A',
        'surface-1': '#111827',
        'surface-2': '#1F2937',
        'bordure-subtile': '#2D3748',
        'texte-principal': '#F9FAFB',
        'texte-secondaire': '#9CA3AF',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-vert": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0, 135, 62, 0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(0, 135, 62, 0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-vert": "pulse-vert 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
      },
    },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;