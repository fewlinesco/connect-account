import userEvent from "@testing-library/user-event";
import React from "react";
import { SWRConfig } from "swr";

import {
  render,
  screen,
  setRouterPathname,
} from "../../config/testing-library-config";
import * as mockUserProfile from "../../mocks/user-profile";
import { userProfile } from "../../mocks/user-profile";
import * as locales from "@content/locales";
import { UserProfileForm } from "@src/components/forms/profile/user-profile-form";

jest.mock("@src/configs/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

describe("UpdateUserProfilePage", () => {
  const path = "/account/profile/user-profile/edit";
  const localizedStrings = locales.en[path];

  beforeAll(() => {
    setRouterPathname(path);
  });

  it("should render proper user profile form elements", async () => {
    expect.assertions(21);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => {
            return { address: mockUserProfile.userProfile };
          },
        }}
      >
        <UserProfileForm userProfileData={userProfile} />
      </SWRConfig>,
    );

    const textInputs = await screen.findAllByRole("textbox");
    expect(textInputs).toHaveLength(8);

    textInputs.forEach((input) => {
      userEvent.clear(input);
      expect(input).toHaveDisplayValue("");
      userEvent.type(input, "test");
      expect(input).toHaveDisplayValue("test");
    });

    expect(
      screen.getByRole("button", { name: localizedStrings.update }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: localizedStrings.update }),
    ).toHaveAttribute("type", "submit");

    expect(
      screen.getByRole("link", { name: localizedStrings.cancel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: localizedStrings.cancel }),
    ).toHaveAttribute("href", "/account/profile/");
  });
});
