import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "camp-bg": "#0D1419",
        "camp-primary": "#FBC627",
        "camp-secondary": "#92D0F3",
        "camp-neutral": "#ABB5BB",
        "camp-warm": "#E6D0A6",
      },
    },
  },
  plugins: [],
} satisfies Config;
