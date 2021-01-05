import { render, RenderOptions, RenderResult } from "@testing-library/react";
import React from "react";

import { AccountApp } from "@src/pages/_app.tsx";

const AllTheProviders: React.ComponentType = ({ children }) => {
  return <AccountApp>{children}</AccountApp>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "queries">,
): RenderResult => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
