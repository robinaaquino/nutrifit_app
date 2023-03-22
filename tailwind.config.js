/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      nf_green: '#00A858',
      nf_yellow: '#FFF011',
      nf_dark_blue: '#326273',
      nf_light_blue: '#5C9EAD'
    },
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
      bitter: ['Bitter', 'serif'],
    },
    extend: {},
  },
  plugins: [],
}
