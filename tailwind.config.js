/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  async redirects() {
    return [
      {
        source: "/products",
        destination: "/maintenance",
        permanent: true,
      },
      {
        source: "/*",
        destination: "/maintenance",
        permanent: true,
      },
    ];
  },
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{html,js}",
    "./src/**/*.{html,js}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      bitter: ["Bitter", "serif"],
    },
    extend: {
      colors: {
        nf_green: "#00A858",
        nf_yellow: "#FFF011",
        nf_dark_blue: "#326273",
        nf_light_blue: "#5C9EAD",
        white: "#FFF",
        black: "#000",
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("tw-elements/dist/plugin"),
    require("@tailwindcss/forms"),
  ],
};
