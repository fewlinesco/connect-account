import { mount } from "enzyme";
import React from "react";
import { ThemeProvider } from "styled-components";

import {
  ReceivedIdentityTypes,
  IdentityTypes,
} from "../../src/@types/Identity";
import { SortedIdentities } from "../../src/@types/SortedIdentities";
import { Layout } from "../../src/components/Layout";
import { DeleteIdentity } from "../../src/components/business/DeleteIdentity";
import { GlobalStyle } from "../../src/design-system/globals/globalStyle";
import { lightTheme } from "../../src/design-system/theme/lightTheme";
import Account from "../../src/pages/account";

jest.mock("../../src/config", () => {
  return {
    config: {
      connectApplicationClientSecret: "foo-bar",
      connectAccountSessionSalt: ".*b+x3ZXE3-h[E+Q5YC5`jr~y%CA~R-[",
    },
  };
});

describe("the delete button should be displayed only when it's relevant (more than 1 occurence of the same id type)", () => {
  test("it should not appear if email and phone list = 1", () => {
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

    const emailTrash = component
      .find(DeleteIdentity)
      .find({ type: IdentityTypes.EMAIL });
    const phoneTrash = component
      .find(DeleteIdentity)
      .find({ type: IdentityTypes.PHONE });

    expect(emailTrash).toHaveLength(0);
    expect(phoneTrash).toHaveLength(0);
  });

  test("it should appear for email if email list > 1", () => {
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
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf2",
          primary: false,
          status: "validated",
          type: ReceivedIdentityTypes.EMAIL,
          value: "test2@test.test",
        },
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf0",
          primary: false,
          status: "validated",
          type: ReceivedIdentityTypes.EMAIL,
          value: "test3@test.test",
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

    const emailTrash = component
      .find(DeleteIdentity)
      .find({ type: IdentityTypes.EMAIL });
    const phoneTrash = component
      .find(DeleteIdentity)
      .find({ type: IdentityTypes.PHONE });

    expect(emailTrash).toHaveLength(3);
    expect(phoneTrash).toHaveLength(0);
  });

  test("it should appear for phone if phone list > 1", () => {
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
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf2",
          primary: false,
          status: "validated",
          type: ReceivedIdentityTypes.PHONE,
          value: "0622116652",
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

    const emailTrash = component
      .find(DeleteIdentity)
      .find({ type: IdentityTypes.EMAIL });
    const phoneTrash = component
      .find(DeleteIdentity)
      .find({ type: IdentityTypes.PHONE });

    expect(emailTrash).toHaveLength(0);
    expect(phoneTrash).toHaveLength(2);
  });

  test("it should appear for both email and phone if phone and email list > 1", () => {
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
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf2",
          primary: false,
          status: "validated",
          type: ReceivedIdentityTypes.PHONE,
          value: "0622116652",
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
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf2",
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

    const emailTrash = component
      .find(DeleteIdentity)
      .find({ type: IdentityTypes.EMAIL });
    const phoneTrash = component
      .find(DeleteIdentity)
      .find({ type: IdentityTypes.PHONE });

    expect(emailTrash).toHaveLength(2);
    expect(phoneTrash).toHaveLength(2);
  });

  test("it should appear for neither email nor phone if phone and email list = 0 (a specific messsage should appear instead)", () => {
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

    const emailTrash = component
      .find(DeleteIdentity)
      .find({ type: IdentityTypes.EMAIL })
      .hostNodes();
    const phoneTrash = component
      .find(DeleteIdentity)
      .find({ type: IdentityTypes.PHONE })
      .hostNodes();
    const noPhone = component.find(".no-phone").hostNodes();
    const noEmail = component.find(".no-email").hostNodes();

    expect(emailTrash).toHaveLength(0);
    expect(phoneTrash).toHaveLength(0);
    expect(noPhone).toHaveLength(1);
    expect(noEmail).toHaveLength(1);
  });
});
