import React from "react";
import { cache, SWRConfig } from "swr";

import { render, screen, waitFor } from "../config/testing-library-config";
import * as mockAddresses from "../mocks/addresses";
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
  afterEach(() => {
    cache.clear();
  });

  it("should render proper address breadcrumbs", async () => {
    expect.assertions(1);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => mockAddresses.primaryAddress,
        }}
      >
        <AddressOverviewPage addressId={mockAddresses.primaryAddress.id} />,
      </SWRConfig>,
    );

    expect(
      await screen.findByRole("heading", { name: /address/i }),
    ).toBeInTheDocument();
  });

  it("should render proper address info", async () => {
    expect.assertions(1);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => mockAddresses.primaryAddress,
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
          fetcher: () => mockAddresses.primaryAddress,
        }}
      >
        <AddressOverviewPage addressId={mockAddresses.primaryAddress.id} />
      </SWRConfig>,
    );

    expect(
      await screen.findByRole("link", {
        name: /Update this address/i,
      }),
    ).toBeInTheDocument();
  });

  it("should not display the 'mark as primary' button when the address is primary", async () => {
    expect.assertions(1);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => mockAddresses.primaryAddress,
        }}
      >
        <AddressOverviewPage addressId={mockAddresses.primaryAddress.id} />
      </SWRConfig>,
    );

    expect(
      await screen.findByRole("button", {
        name: /Use this address as my main address/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("should display the 'mark as primary' button when the address is not primary", async () => {
    expect.assertions(1);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => mockAddresses.nonPrimaryAddress,
        }}
      >
        <AddressOverviewPage addressId={mockAddresses.primaryAddress.id} />
      </SWRConfig>,
    );

    expect(
      await screen.findByRole("button", {
        name: /Use this address as my main address/i,
      }),
    ).toBeInTheDocument();
  });

  it("should display primary badge for a primary address", async () => {
    expect.assertions(1);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => mockAddresses.primaryAddress,
        }}
      >
        <AddressOverviewPage addressId={mockAddresses.primaryAddress.id} />
      </SWRConfig>,
    );

    expect(await screen.findByText("Primary")).toBeTruthy();
  });

  it("shouldn't display primary badge for a non primary address", async () => {
    expect.assertions(1);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => mockAddresses.nonPrimaryAddress,
        }}
      >
        <AddressOverviewPage addressId={mockAddresses.nonPrimaryAddress.id} />
      </SWRConfig>,
    );

    await waitFor(() => {
      expect(screen.queryByText("Primary")).not.toBeInTheDocument();
    });
  });
});
