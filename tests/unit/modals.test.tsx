import userEvent from "@testing-library/user-event";
import React from "react";
import { SWRConfig } from "swr";

import {
  render,
  screen,
  setRouterPathname,
  setRouterQuery,
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

describe("Modals", () => {
  const path = "/account/logins/[type]/[id]";
  const localizedStrings = locales.en[path];
  const displayedIdentity = mockIdentities.nonPrimaryEmailIdentity;

  beforeAll(() => {
    setRouterPathname(path);
    setRouterQuery({ id: displayedIdentity.id });
  });

  it("shouldn't display any confirmation box on first render", async () => {
    expect.assertions(2);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => Promise.resolve([displayedIdentity]),
        }}
      >
        <IdentityOverviewPage identityId={displayedIdentity.id} />
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
    expect.assertions(5);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => Promise.resolve([displayedIdentity]),
        }}
      >
        <IdentityOverviewPage identityId={displayedIdentity.id} />
      </SWRConfig>,
    );

    const markEmailAsPrimaryButton = await screen.findByRole("button", {
      name: localizedStrings.markEmail,
    });

    expect(markEmailAsPrimaryButton).toBeInTheDocument();
    userEvent.click(markEmailAsPrimaryButton);

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

    const cancelMarkEmailAsPrimaryButton = await screen.findByRole("button", {
      name: localizedStrings.primaryModalCancel,
    });

    expect(cancelMarkEmailAsPrimaryButton).toBeInTheDocument();
    userEvent.click(cancelMarkEmailAsPrimaryButton);

    await waitFor(() => {
      expect(cancelMarkEmailAsPrimaryButton).not.toBeInTheDocument();
    });
  });

  it("should display delete confirmation box after clicking on delete button & close it by clicking on cancel button", async () => {
    expect.assertions(5);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => Promise.resolve([displayedIdentity]),
        }}
      >
        <IdentityOverviewPage identityId={displayedIdentity.id} />
      </SWRConfig>,
    );

    const deleteEmailButton = await screen.findByRole("button", {
      name: localizedStrings.deleteEmail,
    });

    expect(deleteEmailButton).toBeInTheDocument();
    userEvent.click(deleteEmailButton);

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

    const cancelDeleteEmailButton = await screen.findByRole("button", {
      name: localizedStrings.deleteModalCancelEmail,
    });

    expect(cancelDeleteEmailButton).toBeInTheDocument();
    userEvent.click(cancelDeleteEmailButton);

    await waitFor(() => {
      expect(cancelDeleteEmailButton).not.toBeInTheDocument();
    });
  });

  //   it("should close confirmation box when clicking outside of it", async () => {
  //     expect.assertions(4);

  //     render(
  //       <SWRConfig
  //         value={{
  //           dedupingInterval: 0,
  //           fetcher: () =>
  //             Promise.resolve(mockIdentities.nonPrimaryEmailIdentity),
  //         }}
  //       >
  //         <IdentityOverviewPage
  //           identityId={mockIdentities.nonPrimaryEmailIdentity.id}
  //         />
  //       </SWRConfig>,
  //     );

  //     const deleteEmailButton = await screen.findByRole("button", {
  //       name: localizedStrings.deleteEmail,
  //     });
  //     expect(
  //       await screen.findByRole("button", {
  //         name: localizedStrings.deleteEmail,
  //       }),
  //     ).toBeInTheDocument();

  //     const modalOverlay = await screen.findByTestId("modal-overlay");
  //     expect(modalOverlay).toBeInTheDocument();
  //     userEvent.click(modalOverlay);

  //     await waitFor(() => {
  //       expect(deleteEmailButton).not.toBeInTheDocument();
  //       expect(modalOverlay).not.toBeInTheDocument();
  //     });
  //   });
});
