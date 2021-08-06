import { Identity } from "@fewlines/connect-management";
import userEvent from "@testing-library/user-event";
import React from "react";
import { mutate, SWRConfig } from "swr";

import {
  render,
  screen,
  setRouterPathname,
} from "../../config/testing-library-config";
import * as mockIdentities from "../../mocks/identities";
import * as locales from "@content/locales";
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

describe("LoginsOverviewPage", () => {
  const path = "/account/logins";
  const localizedStrings = locales.en[path];

  beforeAll(() => {
    setRouterPathname(path);
  });

  describe("Identity type: EMAIL", () => {
    it("should display primary email identity first and all of them when clicking on the show more button", async () => {
      expect.assertions(7);

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
        await screen.findByRole("link", {
          name: new RegExp(`${mockIdentities.primaryEmailIdentity.value}`),
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: mockIdentities.primaryEmailIdentity.value,
        }),
      ).toHaveAttribute(
        "href",
        `/account/logins/${mockIdentities.primaryEmailIdentity.type.toLowerCase()}/${
          mockIdentities.primaryEmailIdentity.id
        }/`,
      );
      expect(
        screen.queryByRole("link", {
          name: mockIdentities.nonPrimaryEmailIdentity.value,
        }),
      ).not.toBeInTheDocument();

      userEvent.click(
        screen.getByText(
          `Show more (${sortedIdentities.emailIdentities.length - 1})`,
        ),
      );

      expect(
        screen.getByRole("link", {
          name: mockIdentities.primaryEmailIdentity.value,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: mockIdentities.nonPrimaryEmailIdentity.value,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: mockIdentities.nonPrimaryEmailIdentity.value,
        }),
      ).toHaveAttribute(
        "href",
        `/account/logins/${mockIdentities.nonPrimaryEmailIdentity.type.toLowerCase()}/${
          mockIdentities.nonPrimaryEmailIdentity.id
        }/`,
      );

      expect(
        screen.getByRole("link", {
          name: `+ ${localizedStrings.emailAddNewIdentityMessage}`,
        }),
      ).toBeInTheDocument();
    });

    it("should display primary email identity without show more button if provided 1 identity", async () => {
      expect.assertions(4);

      const identities = [mockIdentities.primaryEmailIdentity];

      mutate("/api/identities/", identities);

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
        await screen.findByRole("link", {
          name: mockIdentities.primaryEmailIdentity.value,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: mockIdentities.primaryEmailIdentity.value,
        }),
      ).toHaveAttribute(
        "href",
        `/account/logins/${mockIdentities.primaryEmailIdentity.type.toLowerCase()}/${
          mockIdentities.primaryEmailIdentity.id
        }/`,
      );
      expect(
        screen.queryByText(/Show more \([0-9]+\)/),
      ).not.toBeInTheDocument();

      expect(
        screen.getByRole("link", {
          name: `+ ${localizedStrings.emailAddNewIdentityMessage}`,
        }),
      ).toBeInTheDocument();
    });

    it("should display default message when no identity is provided", async () => {
      expect.assertions(3);

      const identities: Identity[] = [];

      mutate("/api/identities/", identities);

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
        await screen.findByText(
          new RegExp(localizedStrings.emailNoIdentityMessage),
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/Show more \([0-9]+\)/),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: `+ ${localizedStrings.emailAddNewIdentityMessage}`,
        }),
      ).toBeInTheDocument();
    });
  });

  describe("Identity type: PHONE", () => {
    it("should display primary phone identity first and all of them when clicking on the show more button", async () => {
      expect.assertions(7);

      const identities = [
        mockIdentities.primaryPhoneIdentity,
        mockIdentities.nonPrimaryPhoneIdentity,
      ];
      const sortedIdentities = sortIdentities(identities);

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
        await screen.findByRole("link", {
          name: new RegExp(`${mockIdentities.primaryPhoneIdentity.value}`),
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: mockIdentities.primaryPhoneIdentity.value,
        }),
      ).toHaveAttribute(
        "href",
        `/account/logins/${mockIdentities.primaryPhoneIdentity.type.toLowerCase()}/${
          mockIdentities.primaryPhoneIdentity.id
        }/`,
      );
      expect(
        screen.queryByRole("link", {
          name: mockIdentities.nonPrimaryPhoneIdentity.value,
        }),
      ).not.toBeInTheDocument();

      userEvent.click(
        screen.getByText(
          `Show more (${sortedIdentities.phoneIdentities.length - 1})`,
        ),
      );

      expect(
        screen.getByRole("link", {
          name: mockIdentities.primaryPhoneIdentity.value,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: mockIdentities.nonPrimaryPhoneIdentity.value,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: mockIdentities.nonPrimaryPhoneIdentity.value,
        }),
      ).toHaveAttribute(
        "href",
        `/account/logins/${mockIdentities.nonPrimaryPhoneIdentity.type.toLowerCase()}/${
          mockIdentities.nonPrimaryPhoneIdentity.id
        }/`,
      );
      expect(
        screen.getByRole("link", {
          name: `+ ${localizedStrings.phoneAddNewIdentityMessage}`,
        }),
      ).toBeInTheDocument();
    });

    it("should display primary phone identity without show more button if provided 1 identity", async () => {
      expect.assertions(4);

      const identities = [mockIdentities.primaryPhoneIdentity];

      mutate("/api/identities/", identities);

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
        await screen.findByRole("link", {
          name: mockIdentities.primaryPhoneIdentity.value,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: mockIdentities.primaryPhoneIdentity.value,
        }),
      ).toHaveAttribute(
        "href",
        `/account/logins/${mockIdentities.primaryPhoneIdentity.type.toLowerCase()}/${
          mockIdentities.primaryPhoneIdentity.id
        }/`,
      );
      expect(
        screen.queryByText(/Show more \([0-9]+\)/),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: `+ ${localizedStrings.phoneAddNewIdentityMessage}`,
        }),
      ).toBeInTheDocument();
    });

    it("should display default message when no identity is provided", async () => {
      expect.assertions(3);

      const identities: Identity[] = [];

      mutate("/api/identities/", identities);

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
        await screen.findByText(
          new RegExp(localizedStrings.phoneNoIdentityMessage),
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/Show more \([0-9]+\)/),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: `+ ${localizedStrings.phoneAddNewIdentityMessage}`,
        }),
      ).toBeInTheDocument();
    });
  });

  describe("Identity type: SOCIAL", () => {
    it("should display all social identities provided without the show more button", async () => {
      expect.assertions(3);

      const identities = [
        mockIdentities.primarySocialIdentity,
        mockIdentities.nonPrimarySocialIdentity,
      ];

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

      await screen.findAllByText(new RegExp("Github")).then((elementList) => {
        expect(elementList[1].innerHTML).toBe("Github");
      });
      await screen.findAllByText(new RegExp("Facebook")).then((elementList) => {
        expect(elementList[1].innerHTML).toBe("Facebook");
      });
      expect(
        screen.queryByText(/Show more \([0-9]+\)/),
      ).not.toBeInTheDocument();
    });

    it("should display default message when no identity is provided", async () => {
      expect.assertions(2);

      const identities: Identity[] = [];

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
        await screen.findByText(
          new RegExp(localizedStrings.socialNoIdentityMessage),
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/Show more \([0-9]+\)/),
      ).not.toBeInTheDocument();
    });
  });
});
