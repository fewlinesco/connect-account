import userEvent from "@testing-library/user-event";
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
import EditAddressPage from "@src/pages/account/profile/addresses/[id]/edit";

jest.mock("@src/configs/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

describe("EditAddressPage", () => {
  const path = "/account/profile/addresses/[id]/edit/";
  const localizedStrings = locales.en[path];

  beforeAll(() => {
    setRouterPathname(path);
  });

  it("should render proper user address form elements", async () => {
    expect.assertions(20);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => {
            return { address: mockAddresses.primaryAddress };
          },
        }}
      >
        <EditAddressPage addressId={mockAddresses.primaryAddress.id} />
      </SWRConfig>,
    );

    expect(
      screen.getByRole("heading", { name: localizedStrings.breadcrumb }),
    ).toBeInTheDocument();

    const textInputs = await screen.findAllByRole("textbox");

    expect(textInputs).toHaveLength(7);

    textInputs.forEach((input) => {
      userEvent.clear(input);
      expect(input).toHaveDisplayValue("");
      userEvent.type(input, "test");
      expect(input).toHaveDisplayValue("test");
    });

    expect(
      screen.getByRole("button", { name: localizedStrings.update }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: localizedStrings.update }),
    ).toHaveAttribute("type", "submit");

    expect(
      await screen.findByRole("link", { name: localizedStrings.cancel }),
    ).toBeInTheDocument();

    waitFor(async () => {
      expect(
        await screen.findByRole("link", { name: localizedStrings.cancel }),
      ).toHaveAttribute(
        "href",
        `/account/profile/addresses/${mockAddresses.primaryAddress.id}/`,
      );
    });
  });
});
