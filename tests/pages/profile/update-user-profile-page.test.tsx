import { HttpStatus } from "@fwl/web";
import userEvent from "@testing-library/user-event";
import * as fetch from "cross-fetch";
import { enableFetchMocks } from "jest-fetch-mock";
import React from "react";
import { SWRConfig } from "swr";

import { render, screen } from "../../config/testing-library-config";
import * as mockUserProfile from "../../mocks/user-profile";
import UpdateUserProfilePage from "@src/pages/account/profile/user-profile/edit";

enableFetchMocks();

jest.mock("@src/configs/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

const mockedFetchJSONResponse = new Response(
  JSON.stringify({ address: mockUserProfile.userProfile }),
  {
    status: HttpStatus.OK,
  },
);

jest.spyOn(fetch, "fetch").mockImplementation(async () => {
  return Promise.resolve(mockedFetchJSONResponse);
});

describe("UpdateUserProfilePage", () => {
  it("should render proper user profile form elements", async () => {
    expect.assertions(18);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => {
            return { address: mockUserProfile.userProfile };
          },
        }}
      >
        <UpdateUserProfilePage />
      </SWRConfig>,
    );

    expect(
      screen.getByRole("heading", { name: /profile \| edit/i }),
    ).toBeInTheDocument();

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
