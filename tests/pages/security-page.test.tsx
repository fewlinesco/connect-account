import React from "react";
import { cache, SWRConfig } from "swr";

import { render, screen } from "../config/testing-library-config";
import SecurityPage from "@src/pages/account/security";

jest.mock("@src/configs/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

describe("SecurityPage", () => {
  afterEach(() => {
    cache.clear();
  });

  test("It should render the security layout", async () => {
    expect.assertions(3);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => {
            return { isPasswordSet: false };
          },
        }}
      >
        <SecurityPage />
      </SWRConfig>,
    );

    await screen
      .findAllByText("Security")
      .then((securityElementList) =>
        expect(securityElementList.length).toEqual(2),
      );
    expect(
      await screen.findByText("Password, login history and more"),
    ).toBeInTheDocument();
    expect(await screen.findByText("Password")).toBeInTheDocument();
  });

  test("The anchor should render 'Set your password' if isPasswordSet is false", async () => {
    expect.assertions(1);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => {
            return { isPasswordSet: false };
          },
        }}
      >
        <SecurityPage />
      </SWRConfig>,
    );

    expect(await screen.findByText(/Set your password/i)).toBeTruthy();
  });

  test("The anchor should render 'Update your password' if isPasswordSet is true", async () => {
    expect.assertions(1);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => {
            return { isPasswordSet: true };
          },
        }}
      >
        <SecurityPage />
      </SWRConfig>,
    );

    expect(await screen.findByText(/Update your password/i)).toBeTruthy();
  });
});
