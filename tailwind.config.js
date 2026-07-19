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
          light: '#4fd1c5',
          DEFAULT: '#38b2ac',
          dark: '#319795',
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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.7s ease-out both',
        'mesh-shift': 'mesh-shift 12s ease-in-out infinite alternate',
      },
      keyframes: {
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'mesh-shift': {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.05) translate(2%, -1%)' },
        },
      },
      zIndex: {
        50: '50',
      },
      transitionProperty: {
        height: 'height',
        spacing: 'margin, padding',
      },
    },
  },
  plugins: [],
}
