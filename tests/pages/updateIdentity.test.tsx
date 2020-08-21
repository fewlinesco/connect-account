jest.mock("../../src/hooks/useCookies");

import { mount } from "enzyme";
import fetch from "jest-fetch-mock";
import { enableFetchMocks } from "jest-fetch-mock";
import React from "react";
import { ThemeProvider } from "styled-components";

import { ReceivedIdentityTypes } from "../../src/@types/Identity";
import { SortedIdentities } from "../../src/@types/SortedIdentities";
import { Button } from "../../src/components/IdentityLine";
import { Layout } from "../../src/components/Layout";
import { UpdateInput, Form } from "../../src/components/UpdateInput";
import { GlobalStyle } from "../../src/design-system/globals/globalStyle";
import { CancelButton } from "../../src/design-system/icons/CancelButton";
import { EditIcon } from "../../src/design-system/icons/EditIcon";
import { lightTheme } from "../../src/design-system/theme/lightTheme";
import { useCookies } from "../../src/hooks/useCookies";
import Account from "../../src/pages/account";

enableFetchMocks();

jest.mock("../../src/config", () => {
  return {
    config: {
      connectApplicationClientSecret: "foo-bar",
      connectAccountSessionSalt: ".*b+x3ZXE3-h[E+Q5YC5`jr~y%CA~R-[",
    },
  };
});

(useCookies as any).mockImplementation(() => {
  return {
    data: {
      userId: "ac3f358d-d2c9-487e-8387-2e6866b853c9",
    },
  };
});

describe("the update form should work properly", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  const mockedSortedResponse: SortedIdentities = {
    phoneIdentities: [
      {
        id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
        primary: false,
        status: "validated",
        type: ReceivedIdentityTypes.PHONE,
        value: "0622116655",
      },
    ],
    emailIdentities: [
      {
        id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
        primary: false,
        status: "validated",
        type: ReceivedIdentityTypes.EMAIL,
        value: "test@test.test",
      },
    ],
  };

  test("it should display the update button for each identity", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <Account sortedIdentities={mockedSortedResponse} />
        </Layout>
      </ThemeProvider>,
    );

    const updateButton = component.find(EditIcon);
    expect(updateButton).toHaveLength(2);
  });

  test("it should display an input and a cancel button when we click on the update button", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <Account sortedIdentities={mockedSortedResponse} />
        </Layout>
      </ThemeProvider>,
    );

    const firstUpdateButton = component.find(Button).first();

    firstUpdateButton.simulate("click");
    const cancelButton = component.find(CancelButton);
    const updateInput = component.find(UpdateInput);
    expect(cancelButton).toHaveLength(1);
    expect(updateInput).toHaveLength(1);
  });

  test("it should submit the form", () => {
    let submitCheck = false;
    const eventListenerCallback = {
      preventDefault: () => (submitCheck = true),
    };

    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <Account sortedIdentities={mockedSortedResponse} />
        </Layout>
      </ThemeProvider>,
    );

    const firstUpdateButton = component.find(Button).first();
    firstUpdateButton.simulate("click");
    const updateInput = component.find(Form).find(".upd-inp").hostNodes();

    expect(updateInput).toHaveLength(1);
    updateInput.simulate("change", {
      target: { value: "test2@test.test" },
    });

    const form = component.find(Form).find(".upd-id-form").hostNodes();
    form.simulate("submit", eventListenerCallback);
    expect(submitCheck).toBe(true);
  });
});
