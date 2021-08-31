import userEvent from "@testing-library/user-event";
import React from "react";
import { SWRConfig } from "swr";

import {
  render,
  screen,
  setRouterPathname,
} from "../../config/testing-library-config";
import * as locales from "@content/locales";
import { Profile } from "@src/@types/profile";
import NewUserProfilePage from "@src/pages/account/profile/user-profile/new";
import * as newProfileSWRFetcher from "@src/queries/new-profile-swr-fetcher";

jest.mock("@src/configs/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

jest
  .spyOn(newProfileSWRFetcher, "newProfileSWRFetcher")
  .mockImplementation(async (_url): Promise<Profile | undefined> => {
    return undefined;
  });

describe("NewUserProfilePage", () => {
  const path = "/account/profile/user-profile/new";
  const localizedStrings = locales.en[path];

  beforeAll(() => {
    setRouterPathname(path);
  });

  it("should render proper user profile form elements", async () => {
    expect.assertions(22);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => Promise.resolve(),
          provider: () => new Map(),
        }}
      >
        <NewUserProfilePage />
      </SWRConfig>,
    );

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
