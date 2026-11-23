/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        brand: {
          purple: "var(--brand-purple)",
          blue: "var(--brand-blue)",
          orange: "var(--brand-orange)",
          navy: "var(--brand-navy)",
          white: "var(--brand-white)",
          bg: "var(--brand-bg)",
          "purple-soft": "var(--brand-purple-soft)",
          "blue-soft": "var(--brand-blue-soft)",
          "peach-soft": "var(--brand-peach-soft)",
          sky: "var(--sky)",
          cyan: "var(--cyan)",
        },
        page: {
          bg: "var(--page-bg)",
          surface: "var(--surface-hi)",
          card: "var(--card-surface)",
          secondary: "var(--secondary-bg)",
          border: "var(--dr-border)",
        },
        ink: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          dim: "var(--muted-ink)",
        },
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(var(--shadow-rgb), 0.08), 0 1px 2px rgba(var(--shadow-rgb), 0.04)",
        card: "0 4px 12px rgba(var(--shadow-rgb), 0.08)",
        dropdown: "0 10px 25px rgba(var(--shadow-rgb), 0.12)",
      },
    },
  },
  plugins: [],
};

