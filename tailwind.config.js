/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // For the App Router
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
    colors: {
        white: "#ffffff",
        gray: {
            50: "#f9fafb",
            100: "#f3f4f6",
            200: "#e5e7eb",
            300: "#d1d5db",
        },
        black: "#000000",
        blue: {
            600: "#2563eb",
            700: "#1d4ed8",
        },
        green: {
            50: "#f0fdf4",
            200: "#bbf7d0",
        },
    },
  },
  plugins: [],
  experimental: {
    optimizeUniversalDefaults: false, // keep this false
  },
};
