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
          DEFAULT: "#08080F",
          2: "#15131F",
          surface: "#101019",
        },
        accent: {
          cyan: "#4ECDC4",
          violet: "#9B59B6",
          blue: "#3B82F6",
        },
        file: {
          pdf: "#E74C3C",
          doc: "#3B82F6",
          sheet: "#22C55E",
          slide: "#F97316",
          img: "#9B59B6",
          png: "#4ECDC4",
          vector: "#F59E0B",
          heic: "#EC4899",
          zip: "#64748B",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Bricolage Grotesque", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "Manrope", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "22px",
        btn: "13px",
        pill: "999px",
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #4ECDC4 0%, #9B59B6 100%)",
        "tri-gradient": "linear-gradient(110deg, #4ECDC4, #9B59B6, #3B82F6, #4ECDC4)",
      },
      boxShadow: {
        lq: "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 2px rgba(0,0,0,0.4), 0 24px 60px rgba(0,0,0,0.45)",
        glow: "0 12px 38px rgba(120,120,200,0.45), inset 0 1px 0 rgba(255,255,255,0.45)",
      },
      keyframes: {
        floatA: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(22px,-16px) scale(1.04)" },
        },
        floatB: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(-26px,20px) scale(1.05)" },
        },
        floatC: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(16px,14px) scale(1.03)" },
        },
        spin: { to: { transform: "rotate(360deg)" } },
        pulseGlow: { "0%,100%": { opacity: "0.5" }, "50%": { opacity: "0.95" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        marqueeRev: { from: { transform: "translateX(-50%)" }, to: { transform: "translateX(0)" } },
        bob: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-9px)" } },
        gradMove: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        floatA: "floatA 46s ease-in-out infinite",
        floatB: "floatB 54s ease-in-out infinite",
        floatC: "floatC 60s ease-in-out infinite",
        spin: "spin 10s linear infinite",
        "pulse-glow": "pulseGlow 7s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
        "marquee-rev": "marqueeRev 46s linear infinite",
        bob: "bob 5s ease-in-out infinite",
        "grad-move": "gradMove 6s ease infinite",
      },
    },
  },
  plugins: [],
};

export default config;
