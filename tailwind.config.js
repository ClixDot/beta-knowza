/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '380px',
      },
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
        'knowza-canvas': '#F6F4DE',
        'knowza-dark': '#25271F',
        // Admin interface palette. Not used by the public site.
        adm: {
          bg: '#F3F1EC',
          panel: '#F7F7F4',
          line: '#D6D9C4',
          ink: '#20281C',
          mute: '#535B4B',
          deep: '#28351F',
          deeper: '#18210F',
          olive: '#79864B',
          sage: '#DDE4C4',
          cream: '#F5F1D6',
          bronze: '#8A7D4C',
        },
      },
      fontFamily: {
        sans: ['"Tenor Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Tenor Sans"', 'Georgia', 'serif'],
        montserrat: ['"Tenor Sans"', 'sans-serif'],
        display: ['"Tenor Sans"', 'sans-serif'],
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
