import { enableFetchMocks } from "jest-fetch-mock";
import React from "react";

import { ReceivedIdentityTypes } from "../src/@types/Identity";
import { SortedIdentities } from "../src/@types/SortedIdentities";
import Index from "../src/pages/index";
import { render, fireEvent } from "./config/test-utils";

enableFetchMocks();

describe("addEmailIdentityWorkflow", () => {
  const mockedFetchedData: SortedIdentities = {
    emailIdentities: [
      {
        id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
        primary: true,
        status: "validated",
        type: ReceivedIdentityTypes.EMAIL,
        value: "test@test.test",
      },
    ],
    phoneIdentities: [
      {
        id: "7f8d168a-3f65-4636-9acb-7720a212680e",
        primary: true,
        status: "validated",
        type: ReceivedIdentityTypes.PHONE,
        value: "0123456789",
      },
    ],
  };

  test("Add email identity user flow with button click", async () => {
    const { getByText, getByRole, getByTestId } = render(
      <Index sortedIdentities={mockedFetchedData} />,
      {},
    );

    const addAnEmailButton = getByText("Add an email");

    fireEvent.click(addAnEmailButton);

    const identityForm = getByTestId("identity-form");

    let submitCheck = false;

    const eventListenerCallback = (event: Event): void => {
      submitCheck = true;
      event.currentTarget?.removeEventListener("submit", eventListenerCallback);
    };

    identityForm.addEventListener("submit", eventListenerCallback);

    const emailInput = getByRole("textbox");

    fireEvent.change(emailInput, { target: { value: "test@test.test" } });

    const sendEmailButton = getByText("Send");

    fireEvent.click(sendEmailButton);

    expect(submitCheck).toBe(true);
  });
});
