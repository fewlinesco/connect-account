import userEvent from "@testing-library/user-event";
import React from "react";
import { SWRConfig } from "swr";

import { render, screen } from "../config/testing-library-config";
import * as mockAddresses from "../mocks/addresses";
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
      screen.getByRole("heading", { name: /address \| edit/i }),
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
      screen.getByRole("button", { name: "Update my address" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Update my address" }),
    ).toHaveAttribute("type", "submit");

    expect(screen.getByRole("link", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cancel" })).toHaveAttribute(
      "href",
      `/account/profile/addresses/${mockAddresses.primaryAddress.id}`,
    );
  });
});
