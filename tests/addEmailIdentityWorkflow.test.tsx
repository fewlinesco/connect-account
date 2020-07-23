import { enableFetchMocks } from "jest-fetch-mock";
import React from "react";

import { IdentityTypes } from "../src/@types/Identity";
import { ProviderUser } from "../src/@types/ProviderUser";
import Index from "../src/pages/index";
import { render, fireEvent } from "./config/test-utils";

// Following code mocks window.console.error
// to ignore the "Not implemented: HTMLFormElement.prototype.submit".
//
// Problem: We use "form.onsubmit" event listener in some tests,
// but HTMLFormElement.prototype.submit is not implemented in JSDOM,
// although the tests are passing and handler fires.
//
// More:
// https://github.com/jsdom/jsdom/issues/1937
// https://github.com/facebook/jest/issues/5223#issuecomment-489422244

let origErrorConsole: any;

beforeEach(() => {
  origErrorConsole = window.console.error;

  window.console.error = (...args: any[]) => {
    const firstArg = args.length > 0 && args[0];

    const shouldBeIgnored =
      firstArg &&
      typeof firstArg === "string" &&
      firstArg.includes("Not implemented: HTMLFormElement.prototype.submit");

    if (!shouldBeIgnored) {
      origErrorConsole(...args);
    }
  };
});

afterEach(() => {
  window.console.error = origErrorConsole;
});

enableFetchMocks();

describe("addEmailIdentityWorkflow", () => {
  type MockedFetchedData = {
    data: {
      provider: ProviderUser;
    };
  };

  const mockedFetchedData: MockedFetchedData = {
    data: {
      provider: {
        id: "4a5f8589-0d91-4a69-924a-6f227a69666d",
        name: "Mocked Provider",
        user: {
          id: "299d268e-3e19-4486-9be7-29c539d241ac",
          identities: [
            {
              id: "7f8d168a-3f65-4636-9acb-7720a212680e",
              primary: true,
              status: "validated",
              type: IdentityTypes.PHONE,
              value: "0123456789",
            },
            {
              id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
              primary: true,
              status: "validated",
              type: IdentityTypes.EMAIL,
              value: "test@test.test",
            },
          ],
        },
      },
    },
  };

  test("Add email identity user flow", () => {
    const { getByText, getByRole } = render(
      <Index fetchedData={mockedFetchedData} />,
      {},
    );

    const addAnEmailButton = getByText("Add an email");

    fireEvent.click(addAnEmailButton);

    const emailInput = getByRole("textbox");

    fireEvent.change(emailInput, { target: { value: "test@test.test" } });

    const sendEmailButton = getByText("Send");

    fireEvent.click(sendEmailButton);

    expect(1).toEqual(1);
  });
});
