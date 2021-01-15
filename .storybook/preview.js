import { ThemeProvider } from 'styled-components';
import { theme } from "../src/design-system/theme";
import { GlobalStyle } from "../src/design-system/globals/global-style";
import Router from 'next/router';
import { RouterContext } from 'next/dist/next-server/lib/router-context';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}

const mockedNextRouter = Router.router = {
  push: () => {},
  replace: () => {},
  prefetch: () => new Promise((resolve) => resolve()),
};

const withMockRouterAndThemeProvider=(Story,context)=>{
  return (
    <RouterContext.Provider value={{...mockedNextRouter}}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Story {...context} />
      </ThemeProvider>
    </RouterContext.Provider>
  )
}

export const decorators = [withMockRouterAndThemeProvider];
