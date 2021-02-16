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
      system: string;
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
      secondary: string;
      background: string;
      boxShadow: string;
      black: string;
      red: string;
      lightGrey: string;
      separator: string;
      box: string;
      breadcrumbs: string;
      blacks: string[];
    };
    transitions: {
      quick: string;
      classic: string;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logo: any;
  }
}
