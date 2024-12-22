/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'vintage-blue': '#01204E', 
        'vintage-cyan': '#5F9EA0',
      }
    },
    fontFamily: {
      'display': ['Major Mono Display', 'monospace'],
    },
  },
  plugins: [],
};
