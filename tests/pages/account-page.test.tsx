import React from "react";
import { SWRConfig } from "swr";

import {
  render,
  screen,
  setRouterPathname,
} from "../config/testing-library-config";
import * as locales from "@content/locales";
import { getSectionListContent } from "@src/components/navigation-bars/navigation-sections";
import AccountPage from "@src/pages/account/index";

jest.mock("@src/configs/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

describe("AccountPage", () => {
  beforeAll(() => {
    setRouterPathname("/account");
  });

  it("should display each account section", async () => {
    const sectionContent = getSectionListContent(true);
    expect.assertions(sectionContent.length * 2);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => {
            return { error: undefined };
          },
        }}
      >
        <AccountPage />
      </SWRConfig>,
    );

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
