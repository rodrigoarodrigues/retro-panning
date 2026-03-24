import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#1A0A00',
        primary: {
          DEFAULT: '#8B2500',
          foreground: '#F5DEB3',
        },
        accent: {
          DEFAULT: '#FF4500',
          foreground: '#1A0A00',
        },
        border: '#CC6600',
        'text-main': '#F5DEB3',
        'text-muted': '#CC9966',
        card: {
          DEFAULT: '#2A1200',
          foreground: '#F5DEB3',
        },
        destructive: {
          DEFAULT: '#FF0000',
          foreground: '#F5DEB3',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        sans: ['"Press Start 2P"', 'monospace'],
        mono: ['"Press Start 2P"', 'monospace'],
      },
      fontSize: {
        'xs':  ['8px',  { lineHeight: '16px' }],
        'sm':  ['10px', { lineHeight: '18px' }],
        'base':['12px', { lineHeight: '22px' }],
        'lg':  ['14px', { lineHeight: '24px' }],
        'xl':  ['16px', { lineHeight: '26px' }],
        '2xl': ['20px', { lineHeight: '30px' }],
        '3xl': ['24px', { lineHeight: '36px' }],
      },
      boxShadow: {
        'pixel': `
          4px 0 0 0 #CC6600,
          -4px 0 0 0 #CC6600,
          0 4px 0 0 #CC6600,
          0 -4px 0 0 #CC6600
        `,
        'pixel-accent': `
          4px 0 0 0 #FF4500,
          -4px 0 0 0 #FF4500,
          0 4px 0 0 #FF4500,
          0 -4px 0 0 #FF4500
        `,
        'pixel-scam': `
          4px 0 0 0 #FF0000,
          -4px 0 0 0 #FF0000,
          0 4px 0 0 #FF0000,
          0 -4px 0 0 #FF0000
        `,
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'flicker': 'flicker 4s infinite',
        'scam-pulse': 'scam-pulse 1s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        flicker: {
          '0%':   { opacity: '0.97' },
          '5%':   { opacity: '0.95' },
          '10%':  { opacity: '1' },
          '50%':  { opacity: '0.98' },
          '80%':  { opacity: '0.96' },
          '100%': { opacity: '1' },
        },
        'scam-pulse': {
          '0%, 100%': { boxShadow: '4px 0 0 0 #FF0000, -4px 0 0 0 #FF0000, 0 4px 0 0 #FF0000, 0 -4px 0 0 #FF0000' },
          '50%':      { boxShadow: '4px 0 0 0 #FF6666, -4px 0 0 0 #FF6666, 0 4px 0 0 #FF6666, 0 -4px 0 0 #FF6666' },
        },
        scanline: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
