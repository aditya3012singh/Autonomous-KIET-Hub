/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // tailwind.config.js
theme: {
  extend: {
    colors: {
      cream: '#fdfaf6',
      sand: '#f7f2ec',
      cocoa: '#4b3e35',
      tan: '#7b6f63',
    },
  }
}

,
  plugins: [],
};
