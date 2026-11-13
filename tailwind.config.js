/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        bg: {
          primary: '#0f0f13',
          secondary: '#16161d',
          card: '#1c1c26',
          hover: '#22222f',
        },
        accent: {
          purple: '#8b5cf6',
          purpleLight: '#a78bfa',
          purpleDark: '#7c3aed',
          pink: '#ec4899',
          blue: '#3b82f6',
        },
        text: {
          primary: '#f1f0fb',
          secondary: '#a09cb8',
          muted: '#5c5878',
        },
        status: {
          done: '#10b981',
          upcoming: '#f59e0b',
          overdue: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '28px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.4)',
        glow: '0 0 20px rgba(139,92,246,0.3)',
        'glow-sm': '0 0 10px rgba(139,92,246,0.2)',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        }
      }
    },
  },
  plugins: [],
}
