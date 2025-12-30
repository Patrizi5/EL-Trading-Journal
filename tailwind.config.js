module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'shell-dark': '#0f0f23',
        'shell-card': '#1a1a2e',
        'shell-accent': '#16213e',
        'shell-glow': '#0f3460',
        'shell-text': '#e0e0e0',
        'shell-green': '#00ff88',
        'shell-red': '#ff3366',
        'shell-yellow': '#ffcc00'
      },
      fontFamily: {
        'shell': ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [],
};