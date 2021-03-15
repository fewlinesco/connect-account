import React from "react";

import { render, screen } from "../config/testing-library-config";
import { AccountApp } from "@src/pages/_app";

describe("Dev buttons", () => {
  test("They should not be pushed", () => {
    render(<AccountApp />);

    expect(screen.queryAllByRole("button").length).toBe(0);
  });
});
