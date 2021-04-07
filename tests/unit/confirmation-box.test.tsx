import { Identity } from "@fewlines/connect-management";
import userEvent from "@testing-library/user-event";
import React from "react";
import { cache, SWRConfig } from "swr";

import { render, screen, waitFor } from "../config/testing-library-config";
import * as mockIdentities from "../mocks/identities";
import IdentityOverviewPage from "@src/pages/account/logins/[type]/[id]";

function makeAsPrimaryRegExFactory(identity: Identity): RegExp {
  return new RegExp(
    "Make " + identity.value + " my primary " + identity.type.toLowerCase(),
  );
}

jest.mock("@src/configs/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

describe("ConfirmationBox", () => {
  afterEach(() => {
    cache.clear();
  });

  it("shouldn't display any confirmation box on first render", async () => {
    expect.assertions(2);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => {
            return { identity: mockIdentities.nonPrimaryEmailIdentity };
          },
        }}
      >
        <IdentityOverviewPage
          identityId={mockIdentities.nonPrimaryEmailIdentity.id}
        />
      </SWRConfig>,
    );

    await waitFor(() => {
      expect(
        screen.queryByText(
          `You are about to set ${mockIdentities.nonPrimaryEmailIdentity.value} as primary.`,
        ),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(
          `You are about to delete ${mockIdentities.nonPrimaryEmailIdentity.value}`,
        ),
      ).not.toBeInTheDocument();
    });
  });

  it.only("should display primary confirmation box after clicking on mark as primary button & close it by clicking on cancel button", async () => {
    expect.assertions(3);

    cache.set("/api/identity/get-identity", {
      identity: mockIdentities.nonPrimaryEmailIdentity,
    });

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => {
            return { identity: mockIdentities.nonPrimaryEmailIdentity };
          },
        }}
      >
        <IdentityOverviewPage
          identityId={mockIdentities.nonPrimaryEmailIdentity.id}
        />
      </SWRConfig>,
    );

    userEvent.click(
      await screen.findByRole("button", {
        name: makeAsPrimaryRegExFactory(mockIdentities.nonPrimaryEmailIdentity),
      }),
    );

    expect(
      await screen.findByText(
        `You are about to set ${mockIdentities.nonPrimaryEmailIdentity.value} as primary.`,
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", {
        name: "Cancel",
      }),
    ).toBeInTheDocument();

    userEvent.click(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    );

    await waitFor(() => {
      expect(
        screen.queryByText(
          `You are about to set ${mockIdentities.nonPrimaryEmailIdentity.value} as primary.`,
        ),
      ).not.toBeVisible();
    });
  });

  it("should display delete confirmation box after clicking on delete button & close it by clicking on cancel button", async () => {
    expect.assertions(3);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => {
            return { identity: mockIdentities.nonPrimaryEmailIdentity };
          },
        }}
      >
        <IdentityOverviewPage
          identityId={mockIdentities.nonPrimaryEmailIdentity.id}
        />
      </SWRConfig>,
    );

    userEvent.click(
      await screen.findByRole("button", {
        name: /Delete this email address/i,
      }),
    );

    expect(
      await screen.findByText(
        `You are about to delete ${mockIdentities.nonPrimaryEmailIdentity.value}`,
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", {
        name: "Keep email address",
      }),
    ).toBeInTheDocument();

    userEvent.click(
      screen.getByRole("button", {
        name: "Keep email address",
      }),
    );

    await waitFor(() => {
      expect(
        screen.queryByText(
          `You are about to delete ${mockIdentities.nonPrimaryEmailIdentity.value}`,
        ),
      ).not.toBeVisible();
    });
  });

  it("should close confirmation box when clicking outside of it", async () => {
    expect.assertions(2);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => {
            return { identity: mockIdentities.nonPrimaryEmailIdentity };
          },
        }}
      >
        <IdentityOverviewPage
          identityId={mockIdentities.nonPrimaryEmailIdentity.id}
        />
      </SWRConfig>,
    );

    userEvent.click(
      await screen.findByRole("button", {
        name: /Delete this email address/i,
      }),
    );

    expect(
      await screen.findByText(
        `You are about to delete ${mockIdentities.nonPrimaryEmailIdentity.value}`,
      ),
    ).toBeInTheDocument();

    userEvent.click(screen.getByTestId("clickAwayListener"));

    await waitFor(() => {
      expect(
        screen.queryByText(
          `You are about to delete ${mockIdentities.nonPrimaryEmailIdentity.value}`,
        ),
      ).not.toBeVisible();
    });
  });
});
