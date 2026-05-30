import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // graphite void — space-gray near-black
        void: {
          950: "#0a0a0b",
          900: "#111113",
          800: "#18181b",
          700: "#232327",
          600: "#34343a",
          500: "#48484f",
        },
        // Apple blue — the structural / primary accent
        flux: {
          600: "#0071e3",
          500: "#2997ff",
          400: "#6cb8ff",
        },
        // rainbow violet — secondary (the 1977 6-stripe mark)
        iris: {
          600: "#8a4fbe",
          500: "#a663cc",
          400: "#c79be0",
        },
        // rainbow green — fresh / "Think Different"
        leaf: {
          600: "#4a9e34",
          500: "#61bb46",
          400: "#8fd47a",
        },
        // rainbow amber/orange — warmth / craft
        gold: {
          600: "#e08a1e",
          500: "#f6a623",
          400: "#ffc15e",
          300: "#ffd791",
          200: "#ffe9c2",
        },
        // rainbow red/coral — passion / the cost
        plasm: {
          600: "#e0433f",
          500: "#ff5e5b",
          400: "#ff8a87",
        },
        // aluminum silver — neutral metal
        steel: {
          500: "#86868b",
          400: "#a1a1a6",
        },
        ink: {
          50: "#f5f5f7",
          100: "#e8e8ed",
          300: "#a1a1a6",
          500: "#6e6e73",
        },
      },
      fontFamily: {
        display: ['"Manrope"', "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ['"Newsreader"', "ui-serif", "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        zh: ['"Noto Serif SC"', "serif"],
        zhsans: ['"Noto Sans SC"', "sans-serif"],
      },
      boxShadow: {
        panel: "inset 0 1px 0 rgba(255,255,255,0.05), 0 24px 64px -30px rgba(0,0,0,0.95)",
        glow: "0 0 48px -10px rgba(41,151,255,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
