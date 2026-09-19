/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Base & Structural Palette
        ink: '#1C1917',         // Warm deep stone 900
        inkLight: '#44403C',    // Stone 700
        concrete: '#FAF8F5',    // Luxury warm alabaster / off-white
        panel: '#FFFFFF',       // Pure white card panel
        slateBorder: '#E7E5E4', // Warm stone border

        // Primary Maroon, Maroon-Orange & Golden Theme
        maroon: {
          DEFAULT: '#881337',   // Rich royal maroon / burgundy (rose 900)
          deep: '#4C0519',      // Deepest wine maroon
          light: '#9F1239',     // Crimson maroon
        },
        maroonOrange: {
          DEFAULT: '#C2410C',   // Burnt maroon-orange / terracotta (orange 700)
          vibrant: '#EA580C',   // Fire maroon-orange (orange 600)
          dark: '#9A3412',      // Deep rust (orange 800)
          light: '#FFEDD5',     // Soft orange tint
        },
        gold: {
          DEFAULT: '#D4AF37',   // Royal metallic gold
          bright: '#F59E0B',    // Radiant amber gold (amber 500)
          deep: '#D97706',      // Deep imperial gold (amber 600)
          dark: '#B45309',      // Rich antique gold (amber 700)
          light: '#FEF3C7',     // Soft champagne gold tint (amber 100)
          glow: '#FDE68A',      // Luminous gold glow (amber 200)
        },

        hazard: '#C2410C',      // Main accent maroon-orange
        hazardDark: '#9A3412',  // Deep maroon-orange hover
        brandAmber: '#D97706',  // Imperial gold highlight
        dispatch: '#881337',    // Royal maroon executive
        signal: '#059669',      // Verified emerald
        alert: '#DC2626',       // Alert crimson
        steel: '#78716C',       // Muted stone 500
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        blueprint:
          'linear-gradient(rgba(217, 119, 6, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(217, 119, 6, 0.04) 1px, transparent 1px)',
        'cyber-grid':
          'linear-gradient(rgba(194, 65, 12, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(194, 65, 12, 0.05) 1px, transparent 1px)',
        mesh:
          'radial-gradient(at 100% 0%, rgba(194, 65, 12, 0.08) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(217, 119, 6, 0.08) 0px, transparent 50%)',
        'hero-gradient':
          'radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.12) 0%, rgba(250, 248, 245, 0) 70%)',
        'hazard-stripe':
          'linear-gradient(135deg, #881337 0%, #C2410C 50%, #D97706 100%)',
        'cyber-gradient':
          'linear-gradient(135deg, rgba(136, 19, 55, 0.15) 0%, rgba(194, 65, 12, 0.15) 50%, rgba(217, 119, 6, 0.15) 100%)',
      },
      backgroundSize: {
        blueprint: '28px 28px',
        'cyber-grid': '36px 36px',
      },
      boxShadow: {
        ticket: '0 15px 35px -5px rgba(136, 19, 55, 0.08), 0 5px 15px -3px rgba(194, 65, 12, 0.04)',
        card: '0 4px 20px -2px rgba(136, 19, 55, 0.05), 0 2px 6px -1px rgba(194, 65, 12, 0.02)',
        elevated: '0 25px 50px -12px rgba(136, 19, 55, 0.12)',
        glow: '0 0 30px -5px rgba(217, 119, 6, 0.25)',
        'cyber-cyan': '0 0 25px rgba(217, 119, 6, 0.35), 0 0 50px rgba(194, 65, 12, 0.15)',
        'cyber-blue': '0 0 25px rgba(136, 19, 55, 0.35), 0 0 50px rgba(136, 19, 55, 0.15)',
        'cyber-emerald': '0 0 20px rgba(5, 150, 105, 0.35)',
        'hologram': '0 0 35px rgba(217, 119, 6, 0.25), inset 0 0 20px rgba(245, 158, 11, 0.1)',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.4, transform: 'scale(1.2)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 2s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
        float: 'float 4s ease-in-out infinite',
        radarSweep: 'radarSweep 4s linear infinite',
        scanline: 'scanline 8s linear infinite',
        glowPulse: 'glowPulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
