import React from "react";

import {
  render,
  screen,
  setRouterPathname,
} from "../config/testing-library-config";
import * as locales from "@content/locales";
import { Profile } from "@src/@types/profile";
import { getSectionListContent } from "@src/components/navigation-bars/navigation-sections";
import AccountPage from "@src/pages/account/index";
import * as navigationFetcher from "@src/queries/swr-navigation-fetcher";

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
  .spyOn(navigationFetcher, "navigationFetcher")
  .mockImplementation(async (_url): Promise<Profile> => {
    return Promise.resolve({
      sub: "",
      name: "",
      family_name: "",
      given_name: "",
      middle_name: "",
      nickname: "",
      preferred_username: "",
      profile: "",
      picture: "",
      website: "",
      gender: "",
      zoneinfo: "",
      locale: "",
      birthdate: "",
      updated_at: "",
    });
  });

describe("AccountPage", () => {
  beforeAll(() => {
    setRouterPathname("/account");
  });

  it("should display each account section", async () => {
    const sectionContent = getSectionListContent(false);
    expect.assertions(sectionContent.length * 2);

    render(<AccountPage />);

    for await (const [sectionName, { textID }] of sectionContent) {
      expect(
        await screen.findByText(
          (locales.en["/account"] as Record<string, string>)[sectionName],
        ),
      ).toBeInTheDocument();
      expect(
        await screen.findByText(
          (locales.en["/account"] as Record<string, string>)[textID],
        ),
      ).toBeInTheDocument();
    }
  });
});
