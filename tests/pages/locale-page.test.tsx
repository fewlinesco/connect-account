import React from "react";
import { SWRConfig } from "swr";

import {
  render,
  screen,
  setRouterPathname,
  waitFor,
} from "../config/testing-library-config";
import LocalePage from "@src/pages/account/locale";
import { AVAILABLE_LANGUAGE } from "@src/utils/get-locale";

jest.mock("@src/configs/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

describe("LocalePage", () => {
  beforeAll(() => {
    setRouterPathname("/account/locale");
  });

  it("Should render a list of radio button", async () => {
    expect.assertions(5);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => Promise.resolve("en"),
          provider: () => new Map(),
        }}
      >
        <LocalePage />
      </SWRConfig>,
    );

    const languageRadioInputs = await screen.findAllByRole("radio");
    expect(languageRadioInputs).toHaveLength(2);

    expect(languageRadioInputs[0]).toBeInTheDocument();
    expect(languageRadioInputs[0]).toHaveAttribute(
      "value",
      AVAILABLE_LANGUAGE.en,
    );

    expect(languageRadioInputs[1]).toBeInTheDocument();
    expect(languageRadioInputs[1]).toHaveAttribute(
      "value",
      AVAILABLE_LANGUAGE.fr,
    );
  });

  test("Radio input should be checked related to Locale set in the DB ", async () => {
    expect.assertions(3);

    render(
      <SWRConfig
        value={{
          dedupingInterval: 0,
          fetcher: () => Promise.resolve("fr"),
          provider: () => new Map(),
        }}
      >
        <LocalePage />
      </SWRConfig>,
    );

    const languageRadioInputs = await screen.findAllByRole("radio");
    expect(languageRadioInputs).toHaveLength(2);

    await waitFor(() => {
      expect(languageRadioInputs[0]).not.toBeChecked();
      expect(languageRadioInputs[1]).toBeChecked();
    });
  });
});
