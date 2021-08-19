import userEvent from "@testing-library/user-event";
import React from "react";
import { SWRConfig } from "swr";

import {
  render,
  screen,
  setRouterPathname,
  waitFor,
} from "../config/testing-library-config";
import * as mockIdentities from "../mocks/identities";
import * as locales from "@content/locales";
import IdentityOverviewPage from "@src/pages/account/logins/[type]/[id]";

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
  const path = "/account/logins/[type]/[id]";
  const localizedStrings = locales.en[path];

  beforeAll(() => {
    setRouterPathname(path);
  });

  it("shouldn't display any confirmation box on first render", async () => {
    expect.assertions(2);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => mockIdentities.nonPrimaryEmailIdentity,
        }}
      >
        <IdentityOverviewPage
          identityId={mockIdentities.nonPrimaryEmailIdentity.id}
        />
      </SWRConfig>,
    );

    await waitFor(() => {
      expect(
        screen.queryByText(localizedStrings.primaryModalContentEmail),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(localizedStrings.deleteModalContentEmail),
      ).not.toBeInTheDocument();
    });
  });

  it("should display primary confirmation box after clicking on mark as primary button & close it by clicking on cancel button", async () => {
    expect.assertions(3);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => mockIdentities.nonPrimaryEmailIdentity,
        }}
      >
        <IdentityOverviewPage
          identityId={mockIdentities.nonPrimaryEmailIdentity.id}
        />
      </SWRConfig>,
    );

    userEvent.click(
      await screen.findByRole("button", {
        name: localizedStrings.markEmail,
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(localizedStrings.primaryModalContentEmail),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: localizedStrings.primaryModalCancel,
        }),
      ).toBeInTheDocument();
    });

    userEvent.click(
      await screen.findByRole("button", {
        name: localizedStrings.primaryModalCancel,
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(new RegExp(localizedStrings.primaryModalContentEmail)),
      ).not.toBeVisible();
    });
  });

  it("should display delete confirmation box after clicking on delete button & close it by clicking on cancel button", async () => {
    expect.assertions(3);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => mockIdentities.nonPrimaryEmailIdentity,
        }}
      >
        <IdentityOverviewPage
          identityId={mockIdentities.nonPrimaryEmailIdentity.id}
        />
      </SWRConfig>,
    );

    userEvent.click(
      await screen.findByRole("button", {
        name: localizedStrings.deleteEmail,
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(localizedStrings.deleteModalContentEmail),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: localizedStrings.deleteModalCancelEmail,
        }),
      ).toBeInTheDocument();
    });

    userEvent.click(
      screen.getByRole("button", {
        name: localizedStrings.deleteModalCancelEmail,
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(new RegExp(localizedStrings.deleteModalContentEmail)),
      ).not.toBeVisible();
    });
  });

  // it("should close confirmation box when clicking outside of it", async () => {
  //   expect.assertions(1);

  //   render(
  //     <SWRConfig
  //       value={{
  //         dedupingInterval: 0,
  //         fetcher: () => {
  //           return { identity: mockIdentities.nonPrimaryEmailIdentity };
  //         },
  //       }}
  //     >
  //       <IdentityOverviewPage
  //         identityId={mockIdentities.nonPrimaryEmailIdentity.id}
  //       />
  //     </SWRConfig>,
  //   );

  //   userEvent.click(
  //     await screen.findByRole("button", {
  //       name: /Delete this email address/i,
  //     }),
  //   );

  // expect(
  //   await screen.findByText(
  //     `You are about to delete ${mockIdentities.nonPrimaryEmailIdentity.value}`,
  //   ),
  // ).toBeInTheDocument();

  //   userEvent.click(screen.getByTestId("modalOverlay"));

  //   await screen
  //     .findByText(
  //       new RegExp(
  //         `You are about to delete ${mockIdentities.nonPrimaryEmailIdentity.value}`,
  //         "i",
  //       ),
  //     )
  //     .then((waitedElement) => {
  //       expect(waitedElement).not.toBeVisible();
  //     });
  // });
});
