/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#821910",   // Main Red
        secondary: "#243169", // Deep Blue
        background: "#F8F9FA",
      },
    },
  },
  plugins: [],
};
