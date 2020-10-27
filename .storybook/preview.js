import { ThemeProvider } from 'styled-components';
import { theme } from "../src/design-system/theme";
import { GlobalStyle } from "../src/design-system/globals/globalStyle";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}

const withThemeProvider=(Story,context)=>{
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Story {...context} />
    </ThemeProvider>
  )
}
export const decorators = [withThemeProvider];
