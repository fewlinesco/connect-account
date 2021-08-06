import React from "react";

import { render, screen } from "../config/testing-library-config";
import { AccountApp } from "@src/pages/_app";

describe("Dev buttons", () => {
  test("They should not be pushed", () => {
    render(<AccountApp />);

    const buttons = screen.queryAllByRole("button");

    const devButtons = buttons.filter((btn) =>
      btn.className.includes("DevButton"),
    );

    expect(devButtons.length).toBe(0);
  });
});
