import { DefaultTheme } from "styled-components";

// Based on Bootstrap breakpoints.
const breakpoints = {
  xs: 576,
  s: 768,
  m: 992,
  l: 1200,
};

type DeviceBreakpoints = {
  xs: string;
  s: string;
  m: string;
  l: string;
};

const deviceBreakpoints = {
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
  primary: "hsl(235, 75%, 38%)",
  secondary: "hsl(234, 45%, 91%)",
  background: "hsl(0, 0%, 100%)",
  boxShadow: "hsla(235, 75%, 38%, 0.08)",
  black: "hsl(235, 90%, 12%)",
  red: "hsl(0, 79%, 63%)",
  lightGrey: "hsl(226, 10%, 59%)",
  separator: "hsl(220, 11%, 95%)",
  box: "hsl(240, 25%, 98%)",
  breadcrumbs: "hsl(190, 4%, 33%)",
  blacks: [
    "hsl(0, 0%, 90%)", // 0
    "hsl(0, 0%, 75%)", // 1
    "hsl(0, 0%, 60%)", // 2
    "hsl(0, 0%, 40%)", // 3
    "hsl(0, 0%, 20%)", // 4
  ],
};

const fonts = {
  system:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu,Cantarell, 'Helvetica Neue', sans-serif;",
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
  h2: "1.8rem",
  h3: "1.4rem",
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
  xs: "0 0 0 0.1rem hsla(0, 0%, 0%, 0.05)",
  sm: "0 0.1rem 0.2rem 0 hsla(0, 0%, 0%, 0.05)",
  base:
    "0 0.1rem 0.3rem hsla(240, 4%, 26%, 0.15), 0 2rem 3rem hsla(240, 4%, 26%, 0.07)",
  left: `0.5rem 0 0.5rem -0.5rem ${colors.blacks[1]}`,
  box: `0 0 1.6rem ${colors.boxShadow}`,
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

const lightTheme: DefaultTheme = {
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

export type { DeviceBreakpoints };
export { lightTheme, deviceBreakpoints };
