import "styled-components";

import { Spacing } from "../design-system/theme/lightTheme";

declare module "styled-components" {
  export interface DefaultTheme {
    spaces: {
      component: Spacing;
      layout: Spacing;
    };
    fontSizes: {
      s: string;
      m: string;
      l: string;
      paragraph: string;
      h1: string;
      h2: string;
      h3: string;
    };
    fontWeights: {
      hairline: number;
      thin: number;
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
      extrabold: number;
      black: number;
    };
    radii: (number | string)[];
    borders: {
      thin: string;
      normal: string;
      large: string;
    };
    lineHeights: {
      solid: number;
      title: number;
      copy: number;
    };
    letterSpacing: {
      normal: string;
      tracked: string;
      tight: string;
      mega: string;
    };
    fonts: {
      sansSerif: string;
    };
    shadows: {
      xs: string;
      sm: string;
      base: string;
      left: string;
    };
    colors: {
      primary: string;
      secondary: string;
      background: string;
      backgroundContrast: string;
      black: string;
      contrastCopy: string;
      red: string;
      green: string;
      turquoise: string;
      yellow: string;
      blacks: string[];
    };
    transitions: {
      quick: string;
      classic: string;
    };
  }
}
