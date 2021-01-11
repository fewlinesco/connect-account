import React from "react";

import { render, screen } from "../config/testing-library-config";
import LocalePage from "@src/pages/account/locale";

jest.mock("@src/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

describe("LocalePage", () => {
  it("should render a search input", () => {
    render(<LocalePage />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByTitle("Magnifying glass")).toBeInTheDocument();
  });
});
