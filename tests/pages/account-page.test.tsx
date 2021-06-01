import React from "react";

import { render, screen } from "../config/testing-library-config";
import { getSectionListContent } from "@src/components/navigation-bars/navigation-sections";
import AccountPage from "@src/pages/account/index";

jest.mock("@src/configs/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

describe("AccountPage", () => {
  it("should display each account section", async () => {
    expect.assertions(6);

    render(<AccountPage />);

    for await (const [sectionName, { text }] of getSectionListContent(false)) {
      expect(
        await screen.findByText(sectionName.replace(/_/g, " ")),
      ).toBeInTheDocument();
      expect(await screen.findByText(text)).toBeInTheDocument();
    }
  });
});
