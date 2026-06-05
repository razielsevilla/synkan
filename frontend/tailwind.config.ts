import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Work Sans', 'sans-serif'],
        anton: ['Anton', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          bg: '#F5F2EA',         /* Warm Off-White Background */
          text: '#0A0A0A',       /* Deep Obsidian Black */
          primary: '#1E3A8A',    /* Royal Blue */
          accent: '#E52B50',     /* Rose Amaranth Red */
          surface: '#FFD700',    /* Bright Gold/Yellow */
          border: '#D1D1D1'      /* Light Neutral Grey */
        }
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #0A0A0A',
        'brutal-lg': '8px 8px 0px 0px #0A0A0A',
        'brutal-sm': '2px 2px 0px 0px #0A0A0A',
      }
    }
  },
  plugins: [],
} satisfies Config
