import React from "react";

import { render, screen } from "../config/testing-library-config";
import { ErrorFallbackComponent } from "@src/components/error-fallback-component/error-fallback-component";

describe("ErrorFallback component", () => {
  test("should render the right content for 404 status code error", () => {
    render(<ErrorFallbackComponent statusCode={404} />);

    expect(
      screen.getByRole("heading", {
        name: "We can't find the page you are looking for.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "homepage" })).toHaveAttribute(
      "href",
      "/account",
    );
  });

  test("should render the right content for others status code error", () => {
    render(<ErrorFallbackComponent statusCode={500} />);

    expect(
      screen.getByRole("heading", {
        name: "Something went wrong. We are working on getting this fixed as soon as we can.",
      }),
    ).toBeInTheDocument();
  });
});
