/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './stories/**/*.stories.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      colors: {
        'primary-800': '#0A2FB6',
        'primary-500': '#365ff5',
        'system-primary': '#fafafa',
        'system-text': '#bfbfbf'
      },
      boxShadow: {
        custom: '0 0 0 1px #0A2FB6',
        error: '0 0 0 1px #ff4d4f',
        right: '0 1px 2px rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15)'
      },
      screens: {
        xs: '275px',
        '3xl':'1680px'
      },
      transitionDuration: {
        400: '400ms'
      }
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' }
      },
      slideUp: {
        '0%': { transform: 'translateY(20px)' },
        '100%': { transform: 'translateY(0)' }
      }
    },
    animation: {
      fadeIn: 'fadeIn 0.5s ease-in-out',
      slideUp: 'slideUp 0.5s ease-in-out'
    }
  },
  plugins: []
}
