import {
  configure,
  render,
  RenderOptions,
  RenderResult,
} from "@testing-library/react";
import { RouterContext } from "next/dist/next-server/lib/router-context";
import { NextRouter } from "next/router";
import React from "react";

import { AccountApp } from "@src/pages/_app";

// Used to remove DOM visualisation from le logs.
configure({
  throwSuggestions: true,
  getElementError: (message) => {
    const error = new Error(message as string);
    error.name = "TestingLibraryElementError";
    return error;
  },
});

const mockLink = ({
  children,
  ...props
}: {
  children: JSX.Element;
}): JSX.Element => {
  return React.cloneElement(children, props);
};

jest.mock("next/link", () => {
  return mockLink;
});

const mockedNextRouter: NextRouter = {
  basePath: "",
  pathname: "/",
  route: "/",
  asPath: "/",
  query: {},
  push: jest.fn(() => Promise.resolve(true)),
  replace: jest.fn(() => Promise.resolve(true)),
  reload: jest.fn(() => Promise.resolve(true)),
  back: jest.fn(() => Promise.resolve(true)),
  prefetch: jest.fn().mockResolvedValue(null),
  beforePopState: jest.fn(() => Promise.resolve(true)),
  events: {
    on: jest.fn(() => Promise.resolve(true)),
    off: jest.fn(() => Promise.resolve(true)),
    emit: jest.fn(() => Promise.resolve(true)),
  },
  isFallback: false,
  isReady: false,
  isLocaleDomain: false,
  isPreview: false,
  locale: "en",
  defaultLocale: "en",
};

function setRouterPathname(pathname: string): NextRouter {
  mockedNextRouter.pathname = pathname;
  return mockedNextRouter;
}

function setRouterQuery(query: Record<string, string>): NextRouter {
  mockedNextRouter.query = query;
  return mockedNextRouter;
}

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
export { customRender as render, setRouterPathname, setRouterQuery };
