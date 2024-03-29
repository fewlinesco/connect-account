import React from "react";
import { SWRConfig } from "swr";

import {
  render,
  screen,
  setRouterPathname,
  setRouterQuery,
  waitFor,
} from "../../config/testing-library-config";
import * as mockIdentities from "../../mocks/identities";
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

describe("IdentityOverviewPage", () => {
  const path = "/account/logins/[type]/[id]";
  const localizedStrings = locales.en[path];

  beforeAll(() => {
    setRouterPathname(path);
  });

  describe("Identity type: EMAIL", () => {
    it("should display the relevant delete & mark as primary buttons but not validate identity one for a non primary validated email address", async () => {
      expect.assertions(4);

      const displayedIdentity = mockIdentities.nonPrimaryEmailIdentity;
      setRouterQuery({ id: displayedIdentity.id });

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => Promise.resolve([displayedIdentity]),
            provider: () => new Map(),
          }}
        >
          <IdentityOverviewPage identityId={displayedIdentity.id} />
        </SWRConfig>,
      );

      expect(
        await screen.findByRole("button", {
          name: localizedStrings.markEmail,
        }),
      ).toBeInTheDocument();
      expect(
        await screen.findByRole("link", {
          name: localizedStrings.updateEmail,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: localizedStrings.deleteEmail }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: localizedStrings.proceed }),
      ).not.toBeInTheDocument();
    });

    it("shouldn't display primary badge nor the awaiting validation one for a non primary validated email", async () => {
      expect.assertions(2);

      const displayedIdentity = mockIdentities.nonPrimaryEmailIdentity;
      setRouterQuery({ id: displayedIdentity.id });

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => Promise.resolve([displayedIdentity]),
            provider: () => new Map(),
          }}
        >
          <IdentityOverviewPage identityId={displayedIdentity.id} />
        </SWRConfig>,
      );

      await waitFor(() => {
        expect(
          screen.queryByText(localizedStrings.primary),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText(localizedStrings.awaiting),
        ).not.toBeInTheDocument();
      });
    });

    it("shouldn't display the delete, mark as primary & validate identity buttons for a primary email address", async () => {
      expect.assertions(3);

      const displayedIdentity = mockIdentities.primaryEmailIdentity;
      setRouterQuery({ id: displayedIdentity.id });

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => Promise.resolve([displayedIdentity]),
            provider: () => new Map(),
          }}
        >
          <IdentityOverviewPage identityId={displayedIdentity.id} />
        </SWRConfig>,
      );

      expect(
        screen.queryByRole("button", {
          name: localizedStrings.markEmail,
        }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: localizedStrings.deleteEmail }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: localizedStrings.proceed }),
      ).not.toBeInTheDocument();
    });

    it("should display primary badge and not the awaiting validation one for a primary email", async () => {
      expect.assertions(2);

      const displayedIdentity = mockIdentities.primaryEmailIdentity;
      setRouterQuery({ id: displayedIdentity.id });

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => Promise.resolve([displayedIdentity]),
            provider: () => new Map(),
          }}
        >
          <IdentityOverviewPage identityId={displayedIdentity.id} />
        </SWRConfig>,
      );

      expect(
        await screen.findByText(mockIdentities.primaryEmailIdentity.value),
      ).toBeTruthy();
      expect(
        screen.queryByText(localizedStrings.awaiting),
      ).not.toBeInTheDocument();
    });

    it("should display the delete & validate identity buttons but not mark as primary one for an unvalidated email address", async () => {
      expect.assertions(3);

      const displayedIdentity = mockIdentities.unvalidatedEmailIdentity;
      setRouterQuery({ id: displayedIdentity.id });

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => Promise.resolve([displayedIdentity]),
            provider: () => new Map(),
          }}
        >
          <IdentityOverviewPage identityId={displayedIdentity.id} />
        </SWRConfig>,
      );

      expect(
        screen.queryByRole("button", {
          name: localizedStrings.markEmail,
        }),
      ).not.toBeInTheDocument();
      expect(
        await screen.findByRole("link", { name: localizedStrings.proceed }),
      ).toHaveAttribute("href", "/account/logins/EMAIL/validation/");
      expect(
        await screen.findByRole("button", {
          name: localizedStrings.deleteEmail,
        }),
      ).toBeInTheDocument();
    });

    it("should display the awaiting validation badge and not primary one for an unvalidated email", async () => {
      expect.assertions(2);

      const displayedIdentity = mockIdentities.unvalidatedEmailIdentity;
      setRouterQuery({ id: displayedIdentity.id });

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => Promise.resolve([displayedIdentity]),
            provider: () => new Map(),
          }}
        >
          <IdentityOverviewPage identityId={displayedIdentity.id} />
        </SWRConfig>,
      );

      expect(
        await screen.findByText(localizedStrings.awaiting),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(localizedStrings.primary),
      ).not.toBeInTheDocument();
    });
  });

  describe("Identity type: PHONE", () => {
    it("should display the relevant delete & mark as primary buttons but not validate identity one for a non primary validated phone number", async () => {
      expect.assertions(4);

      const displayedIdentity = mockIdentities.nonPrimaryPhoneIdentity;
      setRouterQuery({ id: displayedIdentity.id });

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => Promise.resolve([displayedIdentity]),
            provider: () => new Map(),
          }}
        >
          <IdentityOverviewPage identityId={displayedIdentity.id} />
        </SWRConfig>,
      );

      expect(
        await screen.findByRole("button", {
          name: localizedStrings.markPhone,
        }),
      ).toBeInTheDocument();
      expect(
        await screen.findByRole("link", {
          name: localizedStrings.updatePhone,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: localizedStrings.deletePhone }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: localizedStrings.proceed }),
      ).not.toBeInTheDocument();
    });

    it("shouldn't display primary badge nor the awaiting validation one for a non primary validated phone number", async () => {
      expect.assertions(2);

      const displayedIdentity = mockIdentities.nonPrimaryPhoneIdentity;
      setRouterQuery({ id: displayedIdentity.id });

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => Promise.resolve([displayedIdentity]),
            provider: () => new Map(),
          }}
        >
          <IdentityOverviewPage identityId={displayedIdentity.id} />
        </SWRConfig>,
      );

      await waitFor(() => {
        expect(
          screen.queryByText(localizedStrings.primary),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText(localizedStrings.awaiting),
        ).not.toBeInTheDocument();
      });
    });

    it("shouldn't display the delete, mark as primary & validate identity buttons for a primary phone number", async () => {
      expect.assertions(3);

      const displayedIdentity = mockIdentities.primaryPhoneIdentity;
      setRouterQuery({ id: displayedIdentity.id });

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => Promise.resolve([displayedIdentity]),
            provider: () => new Map(),
          }}
        >
          <IdentityOverviewPage identityId={displayedIdentity.id} />
        </SWRConfig>,
      );

      await waitFor(() => {
        expect(
          screen.queryByRole("button", {
            name: localizedStrings.markPhone,
          }),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole("button", {
            name: localizedStrings.deletePhone,
          }),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole("button", {
            name: localizedStrings.proceed,
          }),
        ).not.toBeInTheDocument();
      });
    });

    it("should display primary badge and not the awaiting validation one for a primary phone number", async () => {
      expect.assertions(2);

      const displayedIdentity = mockIdentities.primaryPhoneIdentity;
      setRouterQuery({ id: displayedIdentity.id });

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => Promise.resolve([displayedIdentity]),
            provider: () => new Map(),
          }}
        >
          <IdentityOverviewPage identityId={displayedIdentity.id} />
        </SWRConfig>,
      );

      expect(await screen.findByText(localizedStrings.primary)).toBeTruthy();
      expect(
        screen.queryByText(localizedStrings.awaiting),
      ).not.toBeInTheDocument();
    });

    it("should display the delete & validate identity buttons but not mark as primary one for an unvalidated phone number", async () => {
      expect.assertions(3);

      const displayedIdentity = mockIdentities.unvalidatedPhoneIdentity;
      setRouterQuery({ id: displayedIdentity.id });

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => Promise.resolve([displayedIdentity]),
            provider: () => new Map(),
          }}
        >
          <IdentityOverviewPage identityId={displayedIdentity.id} />
        </SWRConfig>,
      );

      expect(
        await screen.findByRole("button", {
          name: localizedStrings.deletePhone,
        }),
      ).toBeInTheDocument();
      expect(
        await screen.findByRole("link", { name: localizedStrings.proceed }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", {
          name: localizedStrings.markPhone,
        }),
      ).not.toBeInTheDocument();
    });

    it("should display the awaiting validation badge and not primary one for an unvalidated phone number", async () => {
      expect.assertions(2);

      const displayedIdentity = mockIdentities.unvalidatedPhoneIdentity;
      setRouterQuery({ id: displayedIdentity.id });

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => Promise.resolve([displayedIdentity]),
            provider: () => new Map(),
          }}
        >
          <IdentityOverviewPage identityId={displayedIdentity.id} />
        </SWRConfig>,
      );

      expect(
        await screen.findByText(localizedStrings.awaiting),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(localizedStrings.primary),
      ).not.toBeInTheDocument();
    });
  });
});
