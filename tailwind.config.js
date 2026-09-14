/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pyblue: {
          DEFAULT: '#38BDF8',
          dark: '#0284C7',
          light: '#BAE6FD',
          glow: 'rgba(56, 189, 248, 0.25)',
        },
        pygold: {
          DEFAULT: '#FACC15',
          dark: '#CA8A04',
          light: '#FEF08A',
          glow: 'rgba(250, 204, 21, 0.25)',
        },
        slate: {
          850: '#151E2E',
          900: '#0F172A',
          950: '#0B0F19',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
