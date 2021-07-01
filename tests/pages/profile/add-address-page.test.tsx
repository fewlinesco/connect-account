import userEvent from "@testing-library/user-event";
import React from "react";

import {
  render,
  screen,
  setRouterPathname,
} from "../../config/testing-library-config";
import * as locales from "@content/locales";
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
  const path = "/account/profile/addresses/new";
  const localizedStrings = locales.en[path];

  beforeAll(() => {
    setRouterPathname(path);
  });

  it("should render proper user address form elements", async () => {
    expect.assertions(20);

    render(<NewAddressPage />);

    expect(
      screen.getByRole("heading", { name: localizedStrings.breadcrumb }),
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
