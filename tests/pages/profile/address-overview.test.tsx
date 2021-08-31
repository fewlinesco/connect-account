import React from "react";
import { SWRConfig } from "swr";

import {
  render,
  screen,
  setRouterPathname,
  waitFor,
} from "../../config/testing-library-config";
import * as mockAddresses from "../../mocks/addresses";
import * as locales from "@content/locales";
import AddressOverviewPage from "@src/pages/account/profile/addresses/[id]";

jest.mock("@src/configs/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

describe("AddressOverviewPage", () => {
  const path = "/account/profile/addresses/[id]";
  const localizedStrings = locales.en[path];

  beforeAll(() => {
    setRouterPathname(path);
  });

  it("should render proper address breadcrumbs", async () => {
    expect.assertions(1);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => Promise.resolve(mockAddresses.primaryAddress),
          provider: () => new Map(),
        }}
      >
        <AddressOverviewPage addressId={mockAddresses.primaryAddress.id} />,
      </SWRConfig>,
    );

    expect(
      await screen.findByRole("heading", { name: localizedStrings.breadcrumb }),
    ).toBeInTheDocument();
  });

  it("should render proper address info", async () => {
    expect.assertions(1);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => Promise.resolve(mockAddresses.primaryAddress),
          provider: () => new Map(),
        }}
      >
        <AddressOverviewPage addressId={mockAddresses.primaryAddress.id} />,
      </SWRConfig>,
    );

    expect(
      await screen.findByText(
        new RegExp(mockAddresses.primaryAddress.street_address),
      ),
    ).toBeInTheDocument();
  });

  it("should display the update button", async () => {
    expect.assertions(1);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => Promise.resolve(mockAddresses.primaryAddress),
          provider: () => new Map(),
        }}
      >
        <AddressOverviewPage addressId={mockAddresses.primaryAddress.id} />
      </SWRConfig>,
    );

    expect(
      await screen.findByRole("link", {
        name: localizedStrings.update,
      }),
    ).toBeInTheDocument();
  });

  it("should not display the 'mark as primary' button when the address is primary", () => {
    expect.assertions(1);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => Promise.resolve(mockAddresses.primaryAddress),
          provider: () => new Map(),
        }}
      >
        <AddressOverviewPage addressId={mockAddresses.primaryAddress.id} />
      </SWRConfig>,
    );

    expect(
      screen.queryByRole("button", {
        name: localizedStrings.mark,
      }),
    ).not.toBeInTheDocument();
  });

  it("should display the 'mark as primary' button when the address is not primary", async () => {
    expect.assertions(1);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => Promise.resolve(mockAddresses.nonPrimaryAddress),
          provider: () => new Map(),
        }}
      >
        <AddressOverviewPage addressId={mockAddresses.nonPrimaryAddress.id} />
      </SWRConfig>,
    );

    expect(
      await screen.findByRole("button", {
        name: localizedStrings.mark,
      }),
    ).toBeInTheDocument();
  });

  it("should display the delete button", async () => {
    expect.assertions(1);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => Promise.resolve(mockAddresses.primaryAddress),
          provider: () => new Map(),
        }}
      >
        <AddressOverviewPage addressId={mockAddresses.primaryAddress.id} />
      </SWRConfig>,
    );

    expect(
      await screen.findByRole("button", {
        name: localizedStrings.delete,
      }),
    ).toBeInTheDocument();
  });

  it("should display primary badge for a primary address", async () => {
    expect.assertions(1);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => Promise.resolve(mockAddresses.primaryAddress),
          provider: () => new Map(),
        }}
      >
        <AddressOverviewPage addressId={mockAddresses.primaryAddress.id} />
      </SWRConfig>,
    );

    expect(await screen.findByText(localizedStrings.primary)).toBeTruthy();
  });

  it("shouldn't display primary badge for a non primary address", async () => {
    expect.assertions(1);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => Promise.resolve(mockAddresses.nonPrimaryAddress),
          provider: () => new Map(),
        }}
      >
        <AddressOverviewPage addressId={mockAddresses.nonPrimaryAddress.id} />
      </SWRConfig>,
    );

    await waitFor(() => {
      expect(
        screen.queryByText(localizedStrings.primary),
      ).not.toBeInTheDocument();
    });
  });
});
