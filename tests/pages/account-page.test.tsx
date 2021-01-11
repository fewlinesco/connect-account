import React from "react";

import { render, screen } from "../config/testing-library-config";
import { SECTION_LIST_CONTENT } from "@src/components/account-overview/account-overview";
import AccountPage from "@src/pages/account/index";

jest.mock("@src/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

describe("AccountPage", () => {
  it("should display each account section", () => {
    render(<AccountPage />);

    expect(
      screen.getByRole("link", {
        name: "LOGINS " + SECTION_LIST_CONTENT["LOGINS"].text,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "LOGINS " + SECTION_LIST_CONTENT["LOGINS"].text,
      }),
    ).toHaveAttribute("href", "/account/logins");

    expect(
      screen.getByRole("link", {
        name: "SECURITY " + SECTION_LIST_CONTENT["SECURITY"].text,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "SECURITY " + SECTION_LIST_CONTENT["SECURITY"].text,
      }),
    ).toHaveAttribute("href", "/account/security");
  });
});
