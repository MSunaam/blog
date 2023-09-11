/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        red: '#FF8FAC',
        purple: '#9283E0',
        orange: '#FFA599',
        yellow: '#FFD581',
        violet: '#FE90EC',
        blue: '#27AEFF',
        green: '#00DC90',
        bg: '#F9F9FB'
      },
      textColor: {
        default: '#000000',
        passive: '#9FA4AF',
        quote: '#9283E0',
        hover: '#FF5480'
      },
      fontFamily: {
        'Open Sans': ['Open Sans', 'sans-serif'],
      }
    },
  },
  plugins: [require("tw-elements/dist/plugin.cjs")],
}