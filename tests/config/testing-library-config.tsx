import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { RouterContext } from "next/dist/next-server/lib/router-context";
import { NextRouter } from "next/router";
import React from "react";

import { AccountApp } from "@src/pages/_app.tsx";

const mockedNextRouter: NextRouter = {
  basePath: "",
  pathname: "/",
  route: "/",
  asPath: "/",
  query: {},
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn().mockResolvedValue(undefined),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
};

const AllTheProviders: React.ComponentType = ({ children }) => {
  return (
    <RouterContext.Provider value={{ ...mockedNextRouter }}>
      <AccountApp>{children}</AccountApp>
    </RouterContext.Provider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "queries">,
): RenderResult => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";

export { customRender as render };
