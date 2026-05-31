/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        teal:  { 50: '#E1F5EE', 100: '#9FE1CB', 400: '#1D9E75', 600: '#0F6E56', 800: '#085041' },
        coral: { 50: '#FAECE7', 100: '#F5C4B3', 400: '#D85A30', 600: '#993C1D', 800: '#712B13' },
        sand:  { 50: '#FAEEDA', 100: '#FAC775', 400: '#EF9F27', 600: '#BA7517', 800: '#854F0B' },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        mono:    ['"JetBrains Mono"', '"Courier New"', 'monospace'],
        sans:    ['"Geist"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'slide-up':   { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        'fade-in':    { from: { opacity: 0 }, to: { opacity: 1 } },
        'pulse-dot':  { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.2 } },
        'scan-spin':  { to: { transform: 'rotate(360deg)' } },
        'scan-dash':  { '0%': { strokeDashoffset: 240 }, '50%': { strokeDashoffset: 45 }, '100%': { strokeDashoffset: 240 } },
        'bar-grow':   { from: { width: '0%' }, to: {} },
        'ring-fill':  { from: { strokeDashoffset: 251 }, to: {} },
      },
      animation: {
        'slide-up':  'slide-up 0.35s ease-out',
        'fade-in':   'fade-in 0.25s ease-out',
        'pulse-dot': 'pulse-dot 1.2s ease-in-out infinite',
        'scan-spin': 'scan-spin 2.4s linear infinite',
        'scan-dash': 'scan-dash 1.8s ease-in-out infinite',
        'bar-grow':  'bar-grow 0.8s ease-out forwards',
        'ring-fill': 'ring-fill 1.1s cubic-bezier(0.4,0,0.2,1) forwards',
      },
    },
  },
  plugins: [],
}
# Refinement 2: Standardizing code style and formatting
# Refinement 47: Improving code documentation
# Refinement 52: Minor refactoring of function calls
# Refinement 241: Improving consistency across the module
# Refinement 308: Optimizing logic in small sections
