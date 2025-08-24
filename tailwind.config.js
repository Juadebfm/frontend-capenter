/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        swMediumGray: "#A2A2A2",
        swBlack: "#212121",
        swGray: "#828282",
        swLightGray: "#E0E0E0",
        swRed: "#E46D6D",
        swGreen: "#7DB800",
      },
    },
  },
  plugins: [],
};
