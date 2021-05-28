import React from "react";
import { cache, SWRConfig } from "swr";

import { fireEvent, render, screen } from "../config/testing-library-config";
import * as mockIdentities from "../mocks/identities";
import { SortedIdentities } from "@src/@types/sorted-identities";
import LoginsOverviewPage from "@src/pages/account/logins";
import { sortIdentities } from "@src/utils/sort-identities";

jest.mock("@src/configs/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

describe("ShowMoreButton", () => {
  afterEach(() => {
    cache.clear();
  });

  it("should toggle show more button when pressing either enter or space key", async () => {
    expect.assertions(3);

    const identities = [
      mockIdentities.primaryEmailIdentity,
      mockIdentities.nonPrimaryEmailIdentity,
    ];

    const sortedIdentities: SortedIdentities = sortIdentities(identities);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => identities,
        }}
      >
        <LoginsOverviewPage />
      </SWRConfig>,
    );

    expect(
      await screen.findByRole("button", {
        name: `Show ${sortedIdentities.emailIdentities.length - 1} more`,
      }),
    ).toBeInTheDocument();

    fireEvent.keyUp(
      screen.getByText(
        `Show ${sortedIdentities.emailIdentities.length - 1} more`,
      ),
      { key: "Enter", code: "Enter" },
    );

    expect(
      await screen.findByRole("button", {
        name: `Hide ${sortedIdentities.emailIdentities.length - 1}`,
      }),
    ).toBeInTheDocument();

    fireEvent.keyUp(
      screen.getByText(`Hide ${sortedIdentities.emailIdentities.length - 1}`),
      { key: " ", code: "Space" },
    );

    expect(
      await screen.findByRole("button", {
        name: `Show ${sortedIdentities.emailIdentities.length - 1} more`,
      }),
    ).toBeInTheDocument();
  });
});
