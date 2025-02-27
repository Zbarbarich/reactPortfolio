export default {
  content: [
    "./src/**/*.{js,jsx}",
    "./index.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4fd1c5', // Light teal green
          DEFAULT: '#38b2ac', // Base teal green
          dark: '#319795', // Dark teal green
        },
        background: {
          light: '#ffffff',
          dark: '#1a202c',
        },
        text: {
          light: '#2d3748',
          dark: '#f7fafc',
        },
        secondary: '#535bf2',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      animation: {
        'wave': 'wave 15s linear infinite',
      },
      keyframes: {
        wave: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.33%)' }
        },
      },
      zIndex: {
        '50': '50',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
}
