module.exports = {
  purge: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      display: ["Dosis", "sans-serif"],
      body: ['"PT Sans"', "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#0B65AA",
        "link-color": "#074574",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
