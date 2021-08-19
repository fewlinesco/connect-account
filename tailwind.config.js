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
      background: "hsl(0, 0, 100%)",
      black: "hsl(235, 90%, 12%)",
      red: "hsl(0, 79%, 63%)",
      box: "hsl(240, 25%, 98%)",
      separator: "hsl(220, 11%, 95%)",
      gray: {
        DEFAULT: "hsl(0, 0%, 90%)",
        light: "hsl(220, 11%, 95%)",
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
    boxShadow: {
      base: "0 0.1rem 0.3rem hsla(240, 4%, 26%, 0.15), 0 2rem 3rem hsla(240, 4%, 26%, 0.07)",
      box: "0 0 1.6rem hsla(235, 75%, 38%, 0.08)",
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
