import React from "react";
import { cache, SWRConfig } from "swr";

import {
  render,
  screen,
  setRouterPathname,
} from "../config/testing-library-config";
import * as locales from "@content/locales";
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
  const path = "/account/security";
  const localizedStrings = locales.en[path];

  beforeAll(() => {
    setRouterPathname(path);
  });

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
      await screen.findByRole("heading", {
        name: localizedStrings.breadcrumb,
      }),
    ).toBeInTheDocument();

    await screen
      .findAllByRole("heading", { name: localizedStrings.title })
      .then((elementList) => {
        expect(elementList[0].innerHTML).toBe("Security");
      });
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

    expect(await screen.findByText(localizedStrings.setPassword)).toBeTruthy();
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

    expect(
      await screen.findByText(localizedStrings.updatePassword),
    ).toBeTruthy();
  });
});
