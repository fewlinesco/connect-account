import "styled-components";

type Spacing = {
  xxs: string;
  xs: string;
  s: string;
  m: string;
  l: string;
  xl: string;
  xxl: string;
};

declare module "styled-components" {
  export interface DefaultTheme {
    spaces: Spacing;
    fontSizes: {
      xxs: string;
      xs: string;
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
      box: string;
    };
    colors: {
      primary: string;
      primaryBadge: string;
      background: string;
      black: string;
      red: string;
      placeholder: string;
      separator: string;
      box: string;
      blacks: string[];
    };
    transitions: {
      quick: string;
      classic: string;
    };
  }
}
