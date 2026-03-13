/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        void: '#FDFBF7', // Premium Ivory Cream
        abyss: '#FAF7F0', 
        deep: '#F5F2EA', 
        obsidian: '#EEEBE3',
        navy: { DEFAULT: '#0C1D36', dim: '#081426', dark: '#040A14' }, // Primary Corporate
        green: { DEFAULT: '#12332B', dim: '#0D2620', dark: '#081915' }, // Forest Green
        orange: { DEFAULT: '#F8931F', dim: '#E68213', dark: '#CF7511' }, // International Orange
        blue: { DEFAULT: '#0070F3', dim: '#0061D1', dark: '#0051B0' },
        red: '#EF4444',
        amber: '#F59E0B',
        ash: '#475569',
        fog: '#94A3B8',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        mono: ['"DM Mono"', 'monospace'],
        body: ['Syne', 'sans-serif'],
      },
      animation: {
        blink: 'blink 2s infinite',
        ticker: 'ticker 35s linear infinite',
        scan: 'scan 2s ease-in-out infinite',
        scanline: 'scanline 8s linear infinite',
      },
      keyframes: {
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.2 } },
        ticker: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        scan: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(400%)' } },
        scanline: { '0%': { transform: 'translateY(0)' }, '100%': { transform: 'translateY(100vh)' } },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(12,29,54,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(12,29,54,.03) 1px,transparent 1px)",
      },
      backgroundSize: { 'grid': '60px 60px' },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.cut-sm': { 'clip-path': 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))' },
        '.cut-md': { 'clip-path': 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))' },
        '.cut-lg': { 'clip-path': 'polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))' },
        '.glow-orange': { 'text-shadow': '0 0 30px rgba(248,147,31,.3), 0 0 60px rgba(248,147,31,.1)' },
        '.glow-green': { 'text-shadow': '0 0 30px rgba(18,51,43,.3), 0 0 60px rgba(18,51,43,.1)' },
        '.glow-blue': { 'text-shadow': '0 0 30px rgba(0,112,243,.1), 0 0 60px rgba(0,112,243,.05)' },
        '.scrollbar-green': { 'scrollbar-width': 'thin', 'scrollbar-color': '#12332B #F1F5F9' },
        '.scrollbar-orange': { 'scrollbar-width': 'thin', 'scrollbar-color': '#F8931F #F1F5F9' },
      })
    },
  ],
}
