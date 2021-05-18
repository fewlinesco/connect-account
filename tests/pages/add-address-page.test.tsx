import userEvent from "@testing-library/user-event";
import React from "react";

import { render, screen } from "../config/testing-library-config";
import NewAddressPage from "@src/pages/account/profile/addresses/new";

jest.mock("@src/configs/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

describe("NewAddressPage", () => {
  it("should render proper user address form elements", async () => {
    expect.assertions(20);

    render(<NewAddressPage />);

    expect(
      screen.getByRole("heading", { name: /address \| new/i }),
    ).toBeInTheDocument();

    const textInputs = await screen.findAllByRole("textbox");

    expect(textInputs).toHaveLength(7);

    textInputs.forEach((input) => {
      userEvent.clear(input);
      expect(input).toHaveDisplayValue("");
      userEvent.type(input, "test");
      expect(input).toHaveDisplayValue("test");
    });

    expect(
      screen.getByRole("button", { name: "Add address" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add address" })).toHaveAttribute(
      "type",
      "submit",
    );

    expect(screen.getByRole("link", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cancel" })).toHaveAttribute(
      "href",
      "/account/profile",
    );
  });
});
