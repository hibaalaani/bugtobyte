/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Strict brand palette ──────────────────────────
        brand: {
          navy:      '#2D3047',
          'navy-d':  '#1E2138',
          'navy-l':  '#3A3E5C',
          'navy-xl': '#0F1120',
          yellow:    '#FFCB77',
          'yellow-l':'#FFD99A',
          'yellow-d':'#F0B85A',
          teal:      '#4ECDC4',
          coral:     '#FF8A8A',
          mint:      '#A8EDCB',
        },
        // Tailwind shorthand aliases (used as text-brand-mint etc.)
        'brand-mint':  '#A8EDCB',
        'brand-teal':  '#4ECDC4',
        'brand-coral': '#FF8A8A',
        'brand-yellow':'#FFCB77',
      },
      fontFamily: {
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        body:    ['"Plus Jakarta Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-brand':  'linear-gradient(135deg, #2D3047 0%, #1E2138 100%)',
        'gradient-yellow': 'linear-gradient(135deg, #FFCB77 0%, #FFD99A 100%)',
        'gradient-hero':   'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,203,119,0.14) 0%, transparent 65%), linear-gradient(160deg, #0F1120 0%, #1E2138 60%, #0F1120 100%)',
      },
      boxShadow: {
        'glow-y':    '0 0 40px rgba(255,203,119,0.35)',
        'glow-y-lg': '0 0 80px rgba(255,203,119,0.25)',
        'glow-t':    '0 0 40px rgba(78,205,196,0.3)',
        'card':      '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
        'card-h':    '0 20px 56px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.09)',
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
        pulseYellow: { '0%,100%': { boxShadow:'0 0 0 0 rgba(255,203,119,0)' }, '50%': { boxShadow:'0 0 0 10px rgba(255,203,119,0.12)' } },
        blink:       { '0%,100%': { opacity:1 }, '50%': { opacity:0 } },
      },
    },
  },
  plugins: [],
}
