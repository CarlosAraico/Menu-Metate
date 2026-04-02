/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fef9ee",
          100: "#fef0d2",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
      },
    },
  },
  plugins: [],
};

