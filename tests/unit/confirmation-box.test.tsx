import { Identity } from "@fewlines/connect-management";
import userEvent from "@testing-library/user-event";
import React from "react";

import { render, screen, waitFor } from "../config/testing-library-config";
import * as mockIdentities from "../mocks/identities";
import IdentityOverviewPage from "@src/pages/account/logins/[type]/[id]";

const userId = "ac3f358d-d2c9-487e-8387-2e6866b853c9";

function makeAsPrimaryRegExFactory(identity: Identity): RegExp {
  return new RegExp(
    "Make " + identity.value + " my primary " + identity.type.toLowerCase(),
  );
}

jest.mock("@src/config/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

describe("ConfirmationBox", () => {
  it("shouldn't display any confirmation box on first render", () => {
    render(
      <IdentityOverviewPage
        identity={mockIdentities.nonPrimaryEmailIdentity}
        userId={userId}
      />,
    );

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

  it("should display primary confirmation box after clicking on mark as primary button & close it by clicking on cancel button", async () => {
    render(
      <IdentityOverviewPage
        identity={mockIdentities.nonPrimaryEmailIdentity}
        userId={userId}
      />,
    );

    expect.assertions(3);

    userEvent.click(
      screen.getByRole("button", {
        name: makeAsPrimaryRegExFactory(mockIdentities.nonPrimaryEmailIdentity),
      }),
    );

    expect(
      screen.queryByText(
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

    waitFor(() => {
      expect(
        screen.queryByText(
          `You are about to set ${mockIdentities.nonPrimaryEmailIdentity.value} as primary.`,
        ),
      ).not.toBeVisible();
    });
  });

  it("should display delete confirmation box after clicking on delete button & close it by clicking on cancel button", async () => {
    render(
      <IdentityOverviewPage
        identity={mockIdentities.nonPrimaryEmailIdentity}
        userId={userId}
      />,
    );

    expect.assertions(3);

    userEvent.click(
      screen.getByRole("button", {
        name: /Delete this email address/i,
      }),
    );

    expect(
      screen.queryByText(
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

    waitFor(() => {
      expect(
        screen.queryByText(
          `You are about to delete ${mockIdentities.nonPrimaryEmailIdentity.value}`,
        ),
      ).not.toBeVisible();
    });
  });

  it("should close confirmation box when clicking outside of it", () => {
    render(
      <IdentityOverviewPage
        identity={mockIdentities.nonPrimaryEmailIdentity}
        userId={userId}
      />,
    );

    userEvent.click(
      screen.getByRole("button", {
        name: /Delete this email address/i,
      }),
    );

    expect(
      screen.queryByText(
        `You are about to delete ${mockIdentities.nonPrimaryEmailIdentity.value}`,
      ),
    ).toBeInTheDocument();

    userEvent.click(screen.getByTestId("clickAwayListener"));

    waitFor(() => {
      expect(
        screen.queryByText(
          `You are about to delete ${mockIdentities.nonPrimaryEmailIdentity.value}`,
        ),
      ).not.toBeVisible();
    });
  });
});
