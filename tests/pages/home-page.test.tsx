import React from "react";

import {
  render,
  screen,
  setRouterPathname,
} from "../config/testing-library-config";
import HomePage from "@src/pages";

describe("HomePage", () => {
  beforeAll(() => {
    setRouterPathname("/");
  });

  it("should display a description text with provider name and an access link", () => {
    render(<HomePage authorizeURL="/" providerName="Fewlines" />);

    expect(screen.getByText(/Fewlines/i)).toBeTruthy();
    expect(screen.getByRole("link")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/");
  });
});
