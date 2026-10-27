import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "#F8FAFC",
          surface: "#FFFFFF",
          border: "#E2E8F0",
          hover: "#F1F5F9",
        },
        paypal: {
          blue: "#0070BA",
          dark: "#003087",
          sky: "#009CDE",
          light: "#EBF5FB",
        },
        fintech: {
          text: "#0F172A",
          muted: "#475569",
          subtle: "#94A3B8",
          emerald: "#10B981",
          rose: "#F43F5E",
          amber: "#F59E0B",
          indigo: "#6366F1",
        },
      },
      boxShadow: {
        fintech: "0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)",
        card: "0 4px 6px -1px rgba(15, 23, 42, 0.04), 0 2px 4px -2px rgba(15, 23, 42, 0.04)",
        dropdown: "0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
