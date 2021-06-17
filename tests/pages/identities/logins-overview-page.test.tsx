import { Identity } from "@fewlines/connect-management";
import userEvent from "@testing-library/user-event";
import React from "react";
import { cache, SWRConfig } from "swr";

import { render, screen } from "../../config/testing-library-config";
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
  afterEach(() => {
    cache.clear();
  });

  describe("Identity type: EMAIL", () => {
    it.only("should display primary email identity first and all of them when clicking on the show more button", async () => {
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
          name: new RegExp(`${mockIdentities.primaryEmailIdentity.value}`, "i"),
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
        }`,
      );
      expect(
        screen.queryByRole("link", {
          name: mockIdentities.nonPrimaryEmailIdentity.value,
        }),
      ).not.toBeInTheDocument();

      userEvent.click(
        screen.getByText(
          `Show ${sortedIdentities.emailIdentities.length - 1} more`,
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
        }`,
      );

      expect(
        screen.getByRole("link", {
          name: `+ ${locales.en["/account/logins"].emailAddNewIdentityMessage}`,
        }),
      ).toBeInTheDocument();
    });

    it("should display primary email identity without show more button if provided 1 identity", async () => {
      expect.assertions(4);

      const identities = [mockIdentities.primaryEmailIdentity];

      cache.set("/api/identities", identities);

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
        }`,
      );
      expect(screen.queryByText(/Show [0-9]+ more/i)).not.toBeInTheDocument();

      expect(
        screen.getByRole("link", {
          name: `+ ${locales.en["/account/logins"].emailAddNewIdentityMessage}`,
        }),
      ).toBeInTheDocument();
    });

    it("should display default message when no identity is provided", async () => {
      expect.assertions(3);

      const identities: Identity[] = [];

      const sortedIdentities: SortedIdentities = sortIdentities(identities);

      cache.set("/api/identities", identities);

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { sortedIdentities };
            },
          }}
        >
          <LoginsOverviewPage />
        </SWRConfig>,
      );

      expect(
        await screen.findByText(
          new RegExp(locales.en["/account/logins"].emailNoIdentityMessage, "i"),
        ),
      ).toBeInTheDocument();
      expect(screen.queryByText(/Show [0-9]+ more/i)).not.toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: `+ ${locales.en["/account/logins"].emailAddNewIdentityMessage}`,
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
          name: new RegExp(`${mockIdentities.primaryPhoneIdentity.value}`, "i"),
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
        }`,
      );
      expect(
        screen.queryByRole("link", {
          name: mockIdentities.nonPrimaryPhoneIdentity.value,
        }),
      ).not.toBeInTheDocument();

      userEvent.click(
        screen.getByText(
          `Show ${sortedIdentities.phoneIdentities.length - 1} more`,
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
        }`,
      );
      expect(
        screen.getByRole("link", {
          name: `+ ${locales.en["/account/logins"].phoneAddNewIdentityMessage}`,
        }),
      ).toBeInTheDocument();
    });

    it("should display primary phone identity without show more button if provided 1 identity", async () => {
      expect.assertions(4);

      const identities = [mockIdentities.primaryPhoneIdentity];

      cache.set("/api/identities", identities);

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
        }`,
      );
      expect(screen.queryByText(/Show [0-9]+ more/i)).not.toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: `+ ${locales.en["/account/logins"].phoneAddNewIdentityMessage}`,
        }),
      ).toBeInTheDocument();
    });

    it("should display default message when no identity is provided", async () => {
      expect.assertions(3);

      const identities: Identity[] = [];

      const sortedIdentities = sortIdentities(identities);

      cache.set("/api/identities", identities);

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { sortedIdentities };
            },
          }}
        >
          <LoginsOverviewPage />
        </SWRConfig>,
      );

      expect(
        await screen.findByText(
          new RegExp(locales.en["/account/logins"].phoneNoIdentityMessage, "i"),
        ),
      ).toBeInTheDocument();
      expect(screen.queryByText(/Show [0-9]+ more/i)).not.toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: `+ ${locales.en["/account/logins"].phoneAddNewIdentityMessage}`,
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

      await screen
        .findAllByText(new RegExp("Github", "i"))
        .then((elementList) => {
          expect(elementList[1].innerHTML).toBe("Github");
        });
      await screen
        .findAllByText(new RegExp("Facebook", "i"))
        .then((elementList) => {
          expect(elementList[1].innerHTML).toBe("Facebook");
        });
      expect(screen.queryByText(/Show [0-9]+ more/i)).not.toBeInTheDocument();
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
          new RegExp(
            locales.en["/account/logins"].socialNoIdentityMessage,
            "i",
          ),
        ),
      ).toBeInTheDocument();
      expect(screen.queryByText(/Show [0-9]+ more/i)).not.toBeInTheDocument();
    });
  });
});
