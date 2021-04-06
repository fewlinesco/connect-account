import { HttpStatus } from "@fwl/web";
import userEvent from "@testing-library/user-event";
import fetch, { enableFetchMocks } from "jest-fetch-mock";
import React from "react";
import { cache, SWRConfig } from "swr";

import { render, screen } from "../config/testing-library-config";
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

const mockedFetchJson = jest.spyOn(fetchJson, "fetchJson");

beforeAll(() => {
  fetch.resetMocks();
});

const eventId = "5aebc079-c754-4324-93bb-af20d7015fbe";

describe("SudoPage", () => {
  describe("Contact identity choice form", () => {
    it("should render proper form elements and submit button text should update after first submit", async () => {
      expect.assertions(11);

      const primaryIdentities = [
        mockIdentities.primaryEmailIdentity,
        mockIdentities.primaryPhoneIdentity,
      ];

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { primaryIdentities };
            },
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

      const submitButton = screen.getByRole("button", {
        name: "Send confirmation code",
      });
      expect(submitButton).toBeInTheDocument();
      userEvent.click(submitButton);

      const mockedFetchResponse = new Response(JSON.stringify({ eventId }), {
        status: HttpStatus.OK,
      });
      mockedFetchJson.mockResolvedValueOnce(mockedFetchResponse);

      expect(
        await screen.findByRole("button", { name: "Resend confirmation code" }),
      ).toBeInTheDocument();
    });
  });
  describe("Verify validation code form", () => {
    it("should render proper form elements", async () => {
      expect.assertions(8);

      const primaryIdentities = [mockIdentities.primaryPhoneIdentity];

      cache.set("/api/identity/get-primary-identities", { primaryIdentities });

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { primaryIdentities };
            },
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
        name: "Send confirmation code",
      });
      expect(submitButton).toBeInTheDocument();
      userEvent.click(submitButton);

      const mockedFetchResponse = new Response(JSON.stringify({ eventId }), {
        status: HttpStatus.OK,
      });
      mockedFetchJson.mockResolvedValueOnce(mockedFetchResponse);

      expect(
        await screen.findByRole("button", { name: "Resend confirmation code" }),
      ).toBeInTheDocument();

      const validationCodeInput = await screen.findByLabelText(
        "Enter received code here:",
      );

      expect(validationCodeInput).toBeInTheDocument();
      userEvent.type(validationCodeInput, "123456");
      expect(validationCodeInput).toHaveDisplayValue("123456");

      expect(
        screen.getByRole("button", { name: "Confirm" }),
      ).toBeInTheDocument();
    });
  });
});
