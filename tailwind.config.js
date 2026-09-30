module.exports = {
  /** @type {import('tailwindcss').Config} */
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#eef3fb', 100: '#dbe6f6', 200: '#bccfee', 300: '#8fb0e0', 400: '#5d88cf',
          500: '#2f62b8', 600: '#17408f', 700: '#11337a', 800: '#0c2559', 900: '#081a40',
        },
        purple: {
          50: '#f1f5fd', 100: '#dfe8fa', 200: '#c2d3f5', 300: '#93b0ec', 400: '#5f88de',
          500: '#3a66cc', 600: '#24509f', 700: '#1b3f80', 800: '#142f63', 900: '#0d2148',
        },
        gold: { 300: '#f0d27a', 400: '#e6bd52', 500: '#d6a533', 600: '#b98a22' },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
