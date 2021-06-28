import { HttpStatus } from "@fwl/web";
import userEvent from "@testing-library/user-event";
import { enableFetchMocks } from "jest-fetch-mock";
import React from "react";
import { cache, SWRConfig } from "swr";

import {
  render,
  screen,
  setRouterPathname,
} from "../config/testing-library-config";
import * as mockIdentities from "../mocks/identities";
import SudoPage from "@src/pages/account/security/sudo";
import * as fetchJson from "@src/utils/fetch-json";

enableFetchMocks();

jest.mock("@src/configs/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

describe("SudoPage", () => {
  const mockedFetchJson = jest.spyOn(fetchJson, "fetchJson");
  const eventId = "5aebc079-c754-4324-93bb-af20d7015fbe";

  beforeAll(() => {
    setRouterPathname("/account/security/sudo");
  });

  describe("Contact identity choice form", () => {
    it("should render proper form elements and submit button text should update after first submit", async () => {
      expect.assertions(11);

      const mockedFetchJSONResponse = new Response(
        JSON.stringify({ eventId }),
        {
          status: HttpStatus.OK,
        },
      );

      mockedFetchJson.mockImplementationOnce(async () => {
        return Promise.resolve(mockedFetchJSONResponse);
      });

      const primaryIdentities = [
        mockIdentities.primaryEmailIdentity,
        mockIdentities.primaryPhoneIdentity,
      ];

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => primaryIdentities,
          }}
        >
          <SudoPage />
        </SWRConfig>,
      );

      const contactChoiceRadioInputs = await screen.findAllByRole("radio");
      expect(contactChoiceRadioInputs).toHaveLength(2);

      expect(contactChoiceRadioInputs[0]).toBeInTheDocument();
      expect(contactChoiceRadioInputs[0]).toBeChecked();
      expect(contactChoiceRadioInputs[0]).toHaveAttribute(
        "value",
        mockIdentities.primaryEmailIdentity.value,
      );

      expect(contactChoiceRadioInputs[1]).toBeInTheDocument();
      expect(contactChoiceRadioInputs[1]).not.toBeChecked();
      expect(contactChoiceRadioInputs[1]).toHaveAttribute(
        "value",
        mockIdentities.primaryPhoneIdentity.value,
      );

      userEvent.click(contactChoiceRadioInputs[1]);

      expect(contactChoiceRadioInputs[1]).toBeChecked();
      expect(contactChoiceRadioInputs[0]).not.toBeChecked();

      const submitButton = await screen.findByRole("button", {
        name: "Send validation code",
      });
      expect(submitButton).toBeInTheDocument();

      userEvent.click(submitButton);

      expect(
        await screen.findByRole("button", {
          name: "Resend validation code",
        }),
      ).toBeInTheDocument();
    });
  });

  describe("Verify validation code form", () => {
    it("should render proper form elements", async () => {
      expect.assertions(8);

      const mockedFetchJSONResponse = new Response(
        JSON.stringify({ eventId }),
        {
          status: HttpStatus.OK,
        },
      );

      mockedFetchJson.mockImplementationOnce(async () => {
        return Promise.resolve(mockedFetchJSONResponse);
      });

      const primaryIdentities = [mockIdentities.primaryPhoneIdentity];

      cache.set("/api/identity?primary=true", primaryIdentities);

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => primaryIdentities,
          }}
        >
          <SudoPage />
        </SWRConfig>,
      );

      const contactChoiceRadioInput = await screen.findByRole("radio");

      expect(contactChoiceRadioInput).toBeInTheDocument();
      expect(contactChoiceRadioInput).toBeChecked();
      expect(contactChoiceRadioInput).toHaveAttribute(
        "value",
        mockIdentities.primaryPhoneIdentity.value,
      );

      const submitButton = screen.getByRole("button", {
        name: "Send validation code",
      });
      expect(submitButton).toBeInTheDocument();

      userEvent.click(submitButton);

      expect(
        await screen.findByRole("button", { name: "Resend validation code" }),
      ).toBeInTheDocument();

      const validationCodeInput = await screen.findByRole("textbox", {
        name: /enter received code here:/i,
      });
      expect(validationCodeInput).toBeInTheDocument();
      userEvent.type(validationCodeInput, "123456");
      expect(validationCodeInput).toHaveDisplayValue("123456");
      expect(
        screen.getByRole("button", { name: "Confirm" }),
      ).toBeInTheDocument();
    });
  });
});
