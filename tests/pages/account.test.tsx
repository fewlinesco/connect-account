import { mount } from "enzyme";
import React from "react";
import { ThemeProvider } from "styled-components";

import { ReceivedIdentityTypes } from "../../src/@types/Identity";
import { SortedIdentities } from "../../src/@types/SortedIdentities";
import { Layout } from "../../src/components/Layout";
import { BoxedLink } from "../../src/components/display/fewlines/BoxedLink/BoxedLink";
import { ShowMoreButton } from "../../src/components/display/fewlines/ShowMoreButton/ShowMoreButton";
import { GlobalStyle } from "../../src/design-system/globals/globalStyle";
import { lightTheme } from "../../src/design-system/theme/lightTheme";
import Account, { Value } from "../../src/pages/account/logins/index";

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
          primary: true,
          status: "validated",
          type: ReceivedIdentityTypes.PHONE,
          value: "0622116655",
        },
      ],
      emailIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
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
    const boxedLink = component.find(BoxedLink);
    expect(boxedLink).toHaveLength(2);
  });

  test("it should display primary email and primary phone when there are many of each", () => {
    const mockedSortedResponse: SortedIdentities = {
      phoneIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
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
          primary: true,
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
    const boxedLink = component.find(BoxedLink);
    expect(boxedLink).toHaveLength(2);
  });

  test("it should display no emails when there are not", () => {
    const mockedSortedResponse: SortedIdentities = {
      phoneIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
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
    const boxedLink = component.find(BoxedLink);
    const noEmail = component.contains(<Value>No emails</Value>);
    expect(noEmail).toEqual(true);
    expect(boxedLink).toHaveLength(1);
  });

  test("it should display no phones when there are not", () => {
    const mockedSortedResponse: SortedIdentities = {
      phoneIdentities: [],
      emailIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
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
    const boxedLink = component.find(BoxedLink);
    const noPhone = component.contains(<Value>No phones</Value>);

    expect(noPhone).toEqual(true);
    expect(boxedLink).toHaveLength(1);
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
    const noPhone = component.contains(<Value>No phones</Value>);
    const noEmail = component.contains(<Value>No emails</Value>);
    expect(noPhone).toEqual(true);
    expect(noEmail).toEqual(true);
  });
});

describe('the "show more" button should behave properly', () => {
  test("the button's text should be relevant", () => {
    const mockedSortedResponse: SortedIdentities = {
      phoneIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
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
        {
          id: "5r32scc1-530b-4982-878d-33f0def6a7cf",
          primary: false,
          status: "validated",
          type: ReceivedIdentityTypes.PHONE,
          value: "0622116633",
        },
        {
          id: "87uytcc1-530b-4982-878d-33f0def6a7cf",
          primary: false,
          status: "validated",
          type: ReceivedIdentityTypes.PHONE,
          value: "0622116611",
        },
      ],
      emailIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
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
        {
          id: "ttr43cc1-530b-4982-878d-33f0def6a7cf",
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

    const showMoreButton1 = component.find(ShowMoreButton).at(0);
    const showMoreButton2 = component.find(ShowMoreButton).at(1);
    expect(showMoreButton1).toHaveLength(1);
    expect(showMoreButton2).toHaveLength(1);
    expect(showMoreButton1.text()).toEqual("Show 2 more ");
    expect(showMoreButton2.text()).toEqual("Show 3 more ");

    showMoreButton1.simulate("click");
    showMoreButton2.simulate("click");
    expect(showMoreButton1.text()).toEqual("Hide 2 ");
    expect(showMoreButton2.text()).toEqual("Hide 3 ");
  });

  test("the button should show/hide identities", () => {
    const mockedSortedResponse: SortedIdentities = {
      phoneIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
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
          primary: true,
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
    const boxedLink = component.find(BoxedLink);
    const showMoreButton1 = component.find(ShowMoreButton).at(0);
    const showMoreButton2 = component.find(ShowMoreButton).at(1);
    expect(boxedLink).toHaveLength(2);

    showMoreButton1.simulate("click");
    showMoreButton2.simulate("click");
    const boxedLink2 = component.find(BoxedLink);
    expect(boxedLink2).toHaveLength(4);

    showMoreButton1.simulate("click");
    showMoreButton2.simulate("click");
    const boxedLink3 = component.find(BoxedLink);
    expect(boxedLink3).toHaveLength(2);
  });

  test("the button should not appear if the corresponding identity list < 2", () => {
    const mockedSortedResponse: SortedIdentities = {
      phoneIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
          status: "validated",
          type: ReceivedIdentityTypes.PHONE,
          value: "0622116655",
        },
      ],
      emailIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
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
    const showMoreButton = component.find(ShowMoreButton);
    expect(showMoreButton).toHaveLength(0);
  });
});
