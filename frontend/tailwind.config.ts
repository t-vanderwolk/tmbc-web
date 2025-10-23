import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        mauve: "#C8A1B4",
        blush: "#EAC9D1",
        ivory: "#FFFAF8",
        gold: "#D9C48E",
        charcoal: "#3E2F35",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(62, 47, 53, 0.1)",
      },
      borderRadius: {
        xl: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
