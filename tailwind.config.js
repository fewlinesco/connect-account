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
      black: {
        DEFAULT: "hsl(0, 0%, 0%)",
      },
    },
    rounded: {
      DEFAULT: "0.5rem",
      none: 0,
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
