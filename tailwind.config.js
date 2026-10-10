/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'knowza-olive': '#79864B',
        'knowza-forest': '#78793F',
        'knowza-bronze': '#8A7D4C',
        'knowza-dew': '#EEE9BF',
        'knowza-deep': '#28351F',
        'knowza-cream': '#F4F0D5',
        'knowza-sand': '#E3DDC6',
        'knowza-taupe': '#8D8978',
        'knowza-white': '#FAF9F2',
        'knowza-canvas': '#F7F5E0',
        'knowza-dark': '#25271F',
      },
      fontFamily: {
        sans: ['"Montserrat"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Montserrat"', '"Tenor Sans"', 'Georgia', 'serif'],
        montserrat: ['"Montserrat"', 'sans-serif'],
        display: ['"Saira Extra Condensed"', '"Barlow Condensed"', 'Impact', 'sans-serif'],
      },
      fontWeight: {
        light: '500',
        normal: '600',
        medium: '650',
        semibold: '700',
        bold: '800',
        extrabold: '900',
      },
      letterSpacing: {
        'widest-editorial': '0.22em',
        'ultra-wide': '0.35em',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        'editorial': '1360px',
      },
      borderRadius: {
        'subtle': '4px',
        'card': '8px',
      }
    },
  },
  plugins: [],
}
