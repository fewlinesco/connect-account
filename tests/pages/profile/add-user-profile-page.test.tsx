import userEvent from "@testing-library/user-event";
import React from "react";

import {
  render,
  screen,
  setRouterPathname,
} from "../../config/testing-library-config";
import * as locales from "@content/locales";
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
  const path = "/account/profile/user-profile/new";
  const localizedStrings = locales.en[path];

  beforeAll(() => {
    setRouterPathname(path);
  });

  it("should render proper user profile form elements", async () => {
    expect.assertions(22);

    render(<NewUserProfilePage />);

    expect(
      screen.getByRole("heading", { name: localizedStrings.breadcrumb }),
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
      screen.getByRole("button", { name: localizedStrings.add }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: localizedStrings.add }),
    ).toHaveAttribute("type", "submit");

    expect(
      screen.getByRole("link", { name: localizedStrings.cancel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: localizedStrings.cancel }),
    ).toHaveAttribute("href", "/account/");
  });
});
