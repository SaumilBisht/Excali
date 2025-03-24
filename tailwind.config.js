/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./packages/ui/components/**/*.{ts,tsx}",
    "./packages/ui/lib/**/*.{ts,tsx}",
    "./apps/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}