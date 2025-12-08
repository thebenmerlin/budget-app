/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./components/ui/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crimson: "#821910",
        rsblue: "#243169",
      },
    },
  },
  plugins: [],
};
