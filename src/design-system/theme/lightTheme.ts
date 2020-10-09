import { DefaultTheme } from "styled-components";

// Based on Bootstrap breakpoints
const breakpoints = {
  xs: 576,
  s: 768,
  m: 992,
  l: 1200,
};

export const deviceBreakpoints = {
  xs: `(max-width: ${breakpoints.xs}px)`,
  s: `(max-width: ${breakpoints.s}px)`,
  m: `(max-width: ${breakpoints.m}px)`,
  l: `(max-width: ${breakpoints.l}px)`,
};

/* We use 'font-size: 62.5%' globally.
	This font size means that '1rem' is exactly equal to '10px'*/

const borders = {
  thin: "0.1rem solid",
  normal: "0.2rem solid",
  large: "0.4rem solid",
};

const colors = {
  primary: "#1825aa",
  primaryBadge: "#030e80",
  background: "#FFFFFF",
  black: "#202020",
  red: "#EB5757",
  green: "#08D079",
  placeholder: "#8b90a0",
  separator: "#F0F1F3",
  box: "#FAFAFC",
  blacks: [
    "hsl(0, 0%, 90%)", // 0
    "hsl(0, 0%, 75%)", // 1
    "hsl(0, 0%, 60%)", // 2
    "hsl(0, 0%, 40%)", // 3
    "hsl(0, 0%, 20%)", // 4
  ],
};

const fonts = {
  sansSerif:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const fontWeights = {
  hairline: 100,
  thin: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

const fontSizes = {
  xxs: "1rem",
  xs: "1.2rem",
  s: "1.4rem",
  m: "1.8rem",
  l: "2rem",
  paragraph: "1.6rem",
  h1: "2.2rem",
  h2: "2rem",
  h3: "1.8rem",
};

const letterSpacing = {
  normal: "normal",
  tracked: "0.1em",
  tight: "0.05em",
  mega: "0.25em",
};

const lineHeights = {
  solid: 1,
  copy: 1.5,
  title: 2,
};

const radii = ["0.4rem", "0.5rem", "55.5rem", "50%"];

const shadows = {
  xs: "0 0 0 1px rgba(0, 0, 0, 0.05)",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  base: "0 1px 3px rgba(63,63,68,0.15), 0 20px 30px rgba(63,63,68,0.07)",
  left: `5px 0 5px -5px ${colors.blacks[1]}`,
  box: `0px 0px 16px rgba(24, 37, 170, 0.08)`,
};

function spacer(n: number): string {
  const baseSpacer = 4;
  return `${n * baseSpacer}rem`;
}

const spaces = {
  xxs: spacer(0.25),
  xs: spacer(0.5),
  s: spacer(1),
  m: spacer(2),
  l: spacer(4),
  xl: spacer(6),
  xxl: spacer(8),
};

const transitions = {
  quick: "ease-in-out 0.15s",
  classic: "ease-in-out 0.3s",
};

export const lightTheme: DefaultTheme = {
  spaces,
  fontSizes,
  fontWeights,
  lineHeights,
  fonts,
  shadows,
  colors,
  borders,
  letterSpacing,
  radii,
  transitions,
};
