/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Gold colors - all shades used
    'bg-gold-50','bg-gold-100','bg-gold-200','bg-gold-300','bg-gold-400','bg-gold-500','bg-gold-600','bg-gold-700','bg-gold-800','bg-gold-900',
    'text-gold-50','text-gold-100','text-gold-200','text-gold-300','text-gold-400','text-gold-500','text-gold-600','text-gold-700','text-gold-800','text-gold-900',
    'border-gold-50','border-gold-100','border-gold-200','border-gold-300','border-gold-400','border-gold-500','border-gold-600','border-gold-700','border-gold-800','border-gold-900',
    'hover:bg-gold-50','hover:bg-gold-100','hover:bg-gold-400','hover:bg-gold-500','hover:bg-gold-600','hover:bg-gold-700',
    'hover:text-gold-300','hover:text-gold-400','hover:text-gold-500','hover:text-gold-600','hover:text-gold-700',
    'hover:border-gold-400','hover:border-gold-500','hover:border-gold-600',
    // Charcoal colors
    'bg-charcoal-50','bg-charcoal-100','bg-charcoal-200','bg-charcoal-300','bg-charcoal-400','bg-charcoal-500','bg-charcoal-600','bg-charcoal-700','bg-charcoal-800','bg-charcoal-900','bg-charcoal-950',
    'text-charcoal-50','text-charcoal-100','text-charcoal-200','text-charcoal-300','text-charcoal-400','text-charcoal-500','text-charcoal-600','text-charcoal-700','text-charcoal-800','text-charcoal-900','text-charcoal-950',
    'border-charcoal-100','border-charcoal-200','border-charcoal-300','border-charcoal-400','border-charcoal-500','border-charcoal-600','border-charcoal-700','border-charcoal-800','border-charcoal-900',
    'hover:bg-charcoal-800','hover:bg-charcoal-900',
    // Cream colors
    'bg-cream-50','bg-cream-100','bg-cream-200','bg-cream-300',
    'text-cream-50','text-cream-100','text-cream-200',
    // Gradient bg
    'bg-gold-gradient','bg-dark-gradient','bg-luxury-gradient',
    // Font families
    'font-display','font-body','font-arabic','font-sans',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#E8C97A',
          500: '#C9A84C',
          600: '#B8922F',
          700: '#92720A',
          800: '#78590B',
          900: '#3D2B00',
        },
        charcoal: {
          50:  '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
        cream: {
          50:  '#FFFDF5',
          100: '#FFF8E7',
          200: '#FFF0C8',
          300: '#FFE5A0',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Cormorant Garamond', 'Georgia', 'serif'],
        arabic: ['Noto Serif Arabic', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #0d0d0d 100%)',
        'luxury-gradient': 'linear-gradient(160deg, #0d0d0d 0%, #1a1a1a 40%, #0d0d0d 100%)',
      },
      animation: {
        'shimmer': 'shimmer 3s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
