import { ThemeProvider } from 'styled-components';
import { lightTheme } from "../src/design-system/theme/lightTheme";
import { GlobalStyle } from "../src/design-system/globals/globalStyle";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}

const withThemeProvider=(Story,context)=>{
  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyle />
      <Story {...context} />
    </ThemeProvider>
  )
}
export const decorators = [withThemeProvider];
