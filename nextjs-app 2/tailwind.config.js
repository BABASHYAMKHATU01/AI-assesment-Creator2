/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
      },
      boxShadow: {
        'xxs': '0 1px 2px rgba(0, 0, 0, 0.03)',
        'xs': '0 2px 4px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
