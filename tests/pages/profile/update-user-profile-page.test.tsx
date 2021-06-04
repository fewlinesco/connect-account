import userEvent from "@testing-library/user-event";
import React from "react";
import { SWRConfig } from "swr";

import { render, screen } from "../../config/testing-library-config";
import * as mockUserProfile from "../../mocks/user-profile";
import { userProfile } from "../../mocks/user-profile";
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
  it("should render proper user profile form elements", async () => {
    expect.assertions(17);

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

    // Will be fixed in a separate PR
    // expect(
    //   screen.getByRole("heading", { name: /profile \| edit/i }),
    // ).toBeInTheDocument();

    const textInputs = await screen.findAllByRole("textbox");

    expect(textInputs).toHaveLength(6);

    textInputs.forEach((input) => {
      userEvent.clear(input);
      expect(input).toHaveDisplayValue("");
      userEvent.type(input, "test");
      expect(input).toHaveDisplayValue("test");
    });

    expect(
      screen.getByRole("button", { name: "Update my information" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Update my information" }),
    ).toHaveAttribute("type", "submit");

    expect(screen.getByRole("link", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cancel" })).toHaveAttribute(
      "href",
      "/account/profile",
    );
  });
});
