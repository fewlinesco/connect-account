import React from "react";

import { render, screen } from "../config/testing-library-config";
import * as locales from "@content/locales";
import { ErrorFallbackComponent } from "@src/components/error-fallback-component/error-fallback-component";

describe("ErrorFallback component", () => {
  const localizedStrings = locales.en.errors;

  test("should render the right content for 404 status code error", () => {
    render(<ErrorFallbackComponent statusCode={404} />);

    expect(
      screen.getByRole("heading", {
        name: localizedStrings["404Title"],
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: localizedStrings.homepage }),
    ).toHaveAttribute("href", "/account");
  });

  test("should render the right content for others status code error", () => {
    render(<ErrorFallbackComponent statusCode={500} />);

    expect(
      screen.getByRole("heading", {
        name: localizedStrings["500Content"],
      }),
    ).toBeInTheDocument();
  });
});
