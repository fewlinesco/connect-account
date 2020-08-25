import { mount } from "enzyme";
import React from "react";
import { ThemeProvider } from "styled-components";

import { ReceivedIdentityTypes } from "../../src/@types/Identity";
import { SortedIdentities } from "../../src/@types/SortedIdentities";
import { Layout } from "../../src/components/Layout";
import { GlobalStyle } from "../../src/design-system/globals/globalStyle";
import { lightTheme } from "../../src/design-system/theme/lightTheme";
import Account, { IdentityBox } from "../../src/pages/account/logins/index";

jest.mock("../../src/config", () => {
  return {
    config: {
      connectApplicationClientSecret: "foo-bar",
      connectAccountSessionSalt: ".*b+x3ZXE3-h[E+Q5YC5`jr~y%CA~R-[",
    },
  };
});

describe("it should display identities properly", () => {
  test("it should display email and phone when there are one of each", () => {
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
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <Account sortedIdentities={mockedSortedResponse} />
        </Layout>
      </ThemeProvider>,
    );
    const identityBox = component.find(IdentityBox);
    expect(identityBox).toHaveLength(2);
  });

  test("it should display emails and phones where there are many of each", () => {
    const mockedSortedResponse: SortedIdentities = {
      phoneIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: false,
          status: "validated",
          type: ReceivedIdentityTypes.PHONE,
          value: "0622116655",
        },
        {
          id: "7y6edcc1-530b-4982-878d-33f0def6a7cf",
          primary: false,
          status: "validated",
          type: ReceivedIdentityTypes.PHONE,
          value: "0622116688",
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
        {
          id: "66tedcc1-530b-4982-878d-33f0def6a7cf",
          primary: false,
          status: "validated",
          type: ReceivedIdentityTypes.EMAIL,
          value: "test2@test.test",
        },
      ],
    };
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <Account sortedIdentities={mockedSortedResponse} />
        </Layout>
      </ThemeProvider>,
    );
    const identityBox = component.find(IdentityBox);
    expect(identityBox).toHaveLength(4);
  });

  test("it should display no emails when there are not", () => {
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
      emailIdentities: [],
    };
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <Account sortedIdentities={mockedSortedResponse} />
        </Layout>
      </ThemeProvider>,
    );
    const identityBox = component.find(IdentityBox);
    const noEmail = component.find(".no-email").hostNodes();
    expect(noEmail).toHaveLength(1);
    expect(identityBox).toHaveLength(1);
  });

  test("it should display no phones when there are not", () => {
    const mockedSortedResponse: SortedIdentities = {
      phoneIdentities: [],
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
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <Account sortedIdentities={mockedSortedResponse} />
        </Layout>
      </ThemeProvider>,
    );
    const identityBox = component.find(IdentityBox);
    const noPhone = component.find(".no-phone").hostNodes();
    expect(noPhone).toHaveLength(1);
    expect(identityBox).toHaveLength(1);
  });

  test("it should display no emails and no phones where there is nothing", () => {
    const mockedSortedResponse: SortedIdentities = {
      phoneIdentities: [],
      emailIdentities: [],
    };
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <Account sortedIdentities={mockedSortedResponse} />
        </Layout>
      </ThemeProvider>,
    );
    const noPhone = component.find(".no-phone").hostNodes();
    const noEmail = component.find(".no-email").hostNodes();
    expect(noPhone).toHaveLength(1);
    expect(noEmail).toHaveLength(1);
  });
});
