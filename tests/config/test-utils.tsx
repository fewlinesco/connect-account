import { render, RenderResult } from "@testing-library/react";

import { AccountApp } from "../../src/pages/_app";

const customRender = (
  ui: any,
  options: any,
): RenderResult<
  typeof import("../../node_modules/@testing-library/dom/types/queries")
> => render(ui, { wrapper: AccountApp, ...options });

// Re-export everything.
export * from "@testing-library/react";

// Override render method.
export { customRender as render };
