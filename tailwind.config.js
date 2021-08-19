module.exports = {
  purge: [
    "./src/pages/**/*.tsx",
    "./src/components/**/*.tsx",
    "./src/utils/get-social-identities-icon.tsx",
  ],
  darkMode: false,
  theme: {
    colors: {
      primary: "hsl(235, 75%, 38%)",
      background: "hsl(0, 0%, 100%)",
      black: "hsl(0, 0%, 0%)",
      box: "hsl(240, 25%, 98%)",
      separator: "hsl(220, 11%, 95%)",
      gray: {
        DEFAULT: "hsl(0, 0%, 90%)",
      },
    },
    rounded: {
      DEFAULT: "0.5rem",
      none: 0,
    },
    // We are redefining fontSizes here, because since we set 1rem to be equal to 10px
    // in global-style.css, the ones provided by Tailwind were too small.
    fontSize: {
      xs: "1rem",
      s: "1.2rem",
      m: "1.4rem",
      base: "1.6rem",
      l: "1.8rem",
      xl: "2rem",
      xxl: "2.2rem",
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
