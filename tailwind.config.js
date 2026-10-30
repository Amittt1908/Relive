/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F6F2EA',
        cream: '#E9E1D3',
        linen: '#DCD2C1',
        ink: '#22211F',
        graphite: '#4A4844',
        sage: { DEFAULT: '#7E8F72', light: '#C9D2BE', deep: '#4F5E47' },
        terra: { DEFAULT: '#B85C3C', light: '#E9C3B2' },
        olive: '#6E6B3B',
        silver: '#B8BABD',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        base: ['clamp(0.875rem, 0.84rem + 0.18vw, 1rem)', { lineHeight: '1.6' }],
        lg: ['clamp(0.95rem, 0.9rem + 0.3vw, 1.125rem)', { lineHeight: '1.6' }],
        xl: ['clamp(1.05rem, 0.98rem + 0.45vw, 1.25rem)', { lineHeight: '1.5' }],
        '2xl': ['clamp(1.2rem, 1.12rem + 0.35vw, 1.5rem)', { lineHeight: '1.3' }],
        '3xl': ['clamp(1.4rem, 1.25rem + 0.75vw, 1.875rem)', { lineHeight: '1.2' }],
        '4xl': ['clamp(1.7rem, 1.5rem + 1vw, 2.25rem)', { lineHeight: '1.15' }],
        '5xl': ['clamp(2rem, 1.7rem + 1.5vw, 3rem)', { lineHeight: '1.08' }],
        '6xl': ['clamp(2.4rem, 2rem + 2vw, 3.75rem)', { lineHeight: '1.05' }],
        '7xl': ['clamp(2.8rem, 2.25rem + 3vw, 4.5rem)', { lineHeight: '1' }],
        '8xl': ['clamp(3.2rem, 2.5rem + 4vw, 5.5rem)', { lineHeight: '1' }],
        '9xl': ['clamp(3.6rem, 2.8rem + 5vw, 6.5rem)', { lineHeight: '1' }],
        mega: ['clamp(2rem, 6vw, 5.25rem)', { lineHeight: '0.98', letterSpacing: '-0.04em' }],
        hero: ['clamp(1.9rem, 4.6vw, 4rem)', { lineHeight: '1.04', letterSpacing: '-0.035em' }],
        title: ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.12', letterSpacing: '-0.03em' }],
      },
      boxShadow: {
        lift: '0 30px 60px -30px rgba(34,33,31,0.35)',
        tag: '0 8px 18px -10px rgba(34,33,31,0.45)',
      },
      borderRadius: { blob: '46% 54% 40% 60% / 55% 45% 55% 45%' },
    },
  },
  plugins: [],
};
