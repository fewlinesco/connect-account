import { render, RenderResult } from "@testing-library/react";
import { AppProps } from "next/app";
import React from "react";
import { ThemeProvider } from "styled-components";

import { Layout } from "../../src/components/Layout";
import { GlobalStyle } from "../../src/design-system/globals/globalStyle";
import { lightTheme } from "../../src/design-system/theme/lightTheme";

const AllTheProviders: React.FC<JSX.Element> = ({ children }) => {
  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyle />
      <Layout>{children}</Layout>
    </ThemeProvider>
  );
};

const customRender = (
  ui: any,
  options: any,
): RenderResult<
  typeof import("../../node_modules/@testing-library/dom/types/queries")
> => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything.
export * from "@testing-library/react";

// Override render method.
export { customRender as render };
