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
        // Palette: Depth Blue & Accent Yellow
        'depth-blue': '#24366E',
        'depth-blue-light': '#2E4A8C',
        'depth-blue-dark': '#1A264A',
        'accent-yellow': '#FEEB09',
        'accent-yellow-light': '#FFF04D',
        'accent-yellow-soft': '#FFF599',
        'blanc-pure': '#FFFFFF',
        'gris-clair': '#F8F9FA',
        'gris-medium': '#6C757D',
        'gris-fonce': '#343A40',
        'noir-subtil': '#212529',
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
        "chic-gradient": {
          "0%": "rgba(254, 235, 9, 1)",
          "50%": "rgba(36, 54, 110, 1)",
          "100%": "rgba(254, 235, 9, 1)"
        },
        "float-elegant": {
          "0%, 100%": { transform: "translateY(0px) rotateX(0deg)" },
          "50%": { transform: "translateY(-8px) rotateX(2deg)" },
        },
        "glow-yellow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(254, 235, 9, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(254, 235, 9, 0.6)" },
        },
      },
    },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "chic-gradient": "chic-gradient 3s ease-in-out infinite",
        "glow-yellow": "glow-yellow 2s ease-in-out infinite",
        "float-elegant": "float-elegant 4s ease-in-out infinite",
      },
    },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;