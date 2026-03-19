/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Neon brand palette ────────────────────────────
        brand: {
          navy:      '#1A1A2E',
          'navy-d':  '#12122A',
          'navy-l':  '#1E2248',
          'navy-xl': '#0A0C1A',
          yellow:    '#FFD60A',
          'yellow-l':'#FFE040',
          'yellow-d':'#E6BF00',
          cyan:      '#00E5FF',
          'cyan-d':  '#00B8D9',
          green:     '#00E676',
          'green-d': '#00B85A',
          pink:      '#FF4081',
          'pink-d':  '#CC2060',
          purple:    '#C858FF',
          teal:      '#4ECDC4',
          coral:     '#FF8A8A',
          mint:      '#A8EDCB',
        },
        // Tailwind shorthand aliases
        'brand-mint':   '#00E676',
        'brand-teal':   '#00E5FF',
        'brand-coral':  '#FF4081',
        'brand-yellow': '#FFD60A',
        'brand-purple': '#C858FF',
      },
      fontFamily: {
        display: ['"IBM Plex Sans"', 'sans-serif'],
        body:    ['"IBM Plex Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-brand':  'linear-gradient(135deg, #1A1A2E 0%, #0A0C1A 100%)',
        'gradient-yellow': 'linear-gradient(135deg, #FFD60A 0%, #FFE040 100%)',
        'gradient-hero':   'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,214,10,0.18) 0%, transparent 65%), linear-gradient(160deg, #0A0C1A 0%, #0F1224 60%, #0A0C1A 100%)',
      },
      boxShadow: {
        'glow-y':    '0 0 40px rgba(255,214,10,0.40)',
        'glow-y-lg': '0 0 80px rgba(255,214,10,0.28)',
        'glow-c':    '0 0 40px rgba(0,229,255,0.35)',
        'glow-g':    '0 0 40px rgba(0,230,118,0.35)',
        'card':      '0 8px 32px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.06)',
        'card-h':    '0 20px 56px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.09)',
        'glass':     '0 8px 32px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.08)',
      },
      animation: {
        'float':   'float 6s ease-in-out infinite',
        'float-d': 'float 8s ease-in-out infinite 2s',
        'pulse-y': 'pulseYellow 3s ease-in-out infinite',
        'blink':   'blink 1.5s step-end infinite',
      },
      keyframes: {
        float:       { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-12px)' } },
        pulseYellow: { '0%,100%': { boxShadow:'0 0 0 0 rgba(255,214,10,0)' }, '50%': { boxShadow:'0 0 0 10px rgba(255,214,10,0.15)' } },
        blink:       { '0%,100%': { opacity:1 }, '50%': { opacity:0 } },
      },
    },
  },
  plugins: [],
}
