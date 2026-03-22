/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        void: '#F8FAFC', 
        abyss: '#FAF7F0', 
        deep: '#F5F2EA', 
        obsidian: '#EEEBE3',
        navy: { DEFAULT: '#0C1D36', dim: '#081426', dark: '#040A14' }, 
        green: { DEFAULT: '#12332B', dim: '#0D2620', dark: '#081915' }, 
        orange: { DEFAULT: '#F8931F', dim: '#E68213', dark: '#CF7511' }, 
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
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.2 } },
        ticker: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        scan: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(400%)' } },
        scanline: { '0%': { transform: 'translateY(0)' }, '100%': { transform: 'translateY(100vh)' } },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)",
        'carbon': "url('/images/carbon_pattern.png')",
      },
      backgroundSize: { 'grid': '60px 60px' },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.cut-sm': { 'clip-path': 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' },
        '.cut-md': { 'clip-path': 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' },
        '.cut-lg': { 'clip-path': 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' },
        '.glow-orange': { 'filter': 'drop-shadow(0 0 15px rgba(248,147,31,.4))' },
        '.glow-green': { 'filter': 'drop-shadow(0 0 15px rgba(34,197,94,.4))' },
        '.text-glow-orange': { 'text-shadow': '0 0 20px rgba(248,147,31,.5)' },
        '.text-glow-green': { 'text-shadow': '0 0 20px rgba(34,197,94,.5)' },
      })
    },
  ],
}
