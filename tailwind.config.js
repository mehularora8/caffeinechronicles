/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'vintage-blue': '#01204E', // or use rgb(1, 32, 78)
        // You could also name it more specifically:
        // 'navy': '#01204E',
        // 'primary': '#01204E',
      }
    },
    fontFamily: {
      'display': ['Major Mono Display', 'monospace'],
    },
  },
  plugins: [],
};
