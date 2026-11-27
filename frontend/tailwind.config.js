/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#EEF5F1',
          100: '#D8F3DC',
          200: '#B7E4C7',
          300: '#74C69D',
          400: '#52B788',
          500: '#2D6A4F',
          600: '#1B4332',
          700: '#143326',
          800: '#0E241B',
          900: '#081C15',
        },
        mint: {
          50: '#F2FBF5',
          100: '#D8F3DC',
          200: '#B7E4C7',
          300: '#95D5B2',
        },
        cream: {
          50: '#FDFCFA',
          100: '#FAF8F5',
          200: '#F4EFEA',
          300: '#EAE2D9',
        },
        peach: {
          50: '#FFF6F0',
          100: '#FDE8D7',
          200: '#FAD2B4',
          300: '#F4A261',
          400: '#E76F51',
          500: '#D95D39',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Fraunces"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(27, 67, 50, 0.06)',
        'card': '0 8px 30px -4px rgba(27, 67, 50, 0.08)',
        'elevated': '0 20px 40px -8px rgba(27, 67, 50, 0.12)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
