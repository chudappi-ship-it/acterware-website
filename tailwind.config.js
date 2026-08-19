/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans JP"', 'Inter', 'sans-serif'],
      },
      colors: {
        'acter-navy': '#1A3668',
        'acter-blue': '#1673A5',
        'acter-green': '#72C44B',
        'acter-light': '#F4F7F6',
        'acter-dark': '#111827',
        brand: {
          dark: '#0f2a5c',
          DEFAULT: '#1e4a7a',
          teal: '#2a9d8f',
          accent: '#8cc63f',
          light: '#e8f5e9',
        }
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #1A3668, #1673A5, #72C44B)',
        'gradient-brand-hover': 'linear-gradient(to right, #13284f, #125c84, #5a9c3c)',
      }
    },
  },
  plugins: [],
}
