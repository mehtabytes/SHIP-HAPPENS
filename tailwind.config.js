/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        trust: {
          proven: '#10b981',   // Green
          weak: '#f59e0b',     // Amber
          stale: '#ef4444',    // Red
          unproven: '#6b7280'  // Grey
        },
        dark: {
          bg: '#0f1115',       // Deep navy/charcoal background
          panel: '#1a1d24',    // Lighter dark for cards
          border: '#2a2e37'    // Subtle borders
        }
      }
    },
  },
  plugins: [],
}