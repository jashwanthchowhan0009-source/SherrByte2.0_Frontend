import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          400: '#1565E8',
          500: '#1565E8',
          600: '#003E91',
          700: '#002063',
          800: '#041642',
          900: '#020B1A',
        },
        pillar: {
          society:  '#1E88E5',
          economy:  '#FBC02D',
          tech:     '#3949AB',
          arts:     '#E53935',
          nature:   '#43A047',
          selfwell: '#FB8C00',
          philo:    '#8E24AA',
          lifestyle:'#00ACC1',
          sports:   '#546E7A',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 1.4s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.32,0.72,0,1)',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
