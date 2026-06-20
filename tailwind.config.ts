import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0B0B14",
          alt: "#0E0F1A",
        },
        surface: "rgba(255,255,255,0.04)",
        hairline: "rgba(255,255,255,0.08)",
        accent: {
          cyan: "#4ECDC4",
          violet: "#9B59B6",
        },
        file: {
          pdf: "#E74C3C",
          image: "#2ECC71",
          doc: "#3498DB",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "rgba(255,255,255,0.5)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
        pill: "24px",
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #4ECDC4 0%, #9B59B6 100%)",
        "accent-gradient-soft":
          "linear-gradient(135deg, rgba(78,205,196,0.18) 0%, rgba(155,89,182,0.18) 100%)",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(78,205,196,0.35)",
        "glow-violet": "0 0 48px -8px rgba(155,89,182,0.4)",
        card: "0 8px 32px -12px rgba(0,0,0,0.6)",
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-24px,0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.85" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        float: "float 9s ease-in-out infinite",
        "pulse-glow": "pulseGlow 6s ease-in-out infinite",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
