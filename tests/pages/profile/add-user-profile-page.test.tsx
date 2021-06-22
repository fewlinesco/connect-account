import userEvent from "@testing-library/user-event";
import React from "react";

import {
  render,
  screen,
  setRouterPathname,
} from "../../config/testing-library-config";
import NewUserProfilePage from "@src/pages/account/profile/user-profile/new";

jest.mock("@src/configs/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

describe("NewUserProfilePage", () => {
  beforeAll(() => {
    setRouterPathname("/account/profile/user-profile/new");
  });

  it("should render proper user profile form elements", async () => {
    expect.assertions(22);

    render(<NewUserProfilePage />);

    expect(
      screen.getByRole("heading", { name: /profile \| new/i }),
    ).toBeInTheDocument();

    const textInputs = await screen.findAllByRole("textbox");

    expect(textInputs).toHaveLength(8);

    textInputs.forEach((input) => {
      userEvent.clear(input);
      expect(input).toHaveDisplayValue("");
      userEvent.type(input, "test");
      expect(input).toHaveDisplayValue("test");
    });

    expect(
      screen.getByRole("button", { name: "Add my information" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add my information" }),
    ).toHaveAttribute("type", "submit");

    expect(screen.getByRole("link", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cancel" })).toHaveAttribute(
      "href",
      "/account",
    );
  });
});
