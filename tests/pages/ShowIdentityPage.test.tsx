jest.mock("@src/hooks/useCookies");

import { mount } from "enzyme";
import fetch from "jest-fetch-mock";
import { enableFetchMocks } from "jest-fetch-mock";
import React from "react";
import { ThemeProvider } from "styled-components";

import { ReceivedIdentityTypes, Identity } from "@src/@types/Identity";
import { Layout } from "@src/components/Layout";
import { AwaitingValidationBadge } from "@src/components/display/fewlines/AwaitingValidationBadge/AwaitingValidationBadge";
import {
  Button,
  ButtonVariant,
} from "@src/components/display/fewlines/Button/Button";
import { NavigationBreadcrumbs } from "@src/components/display/fewlines/NavigationBreadcrumbs/NavigationBreadcrumbs";
import { PrimaryBadge } from "@src/components/display/fewlines/PrimaryBadge/PrimaryBadge";
import { GlobalStyle } from "@src/design-system/globals/globalStyle";
import { lightTheme } from "@src/design-system/theme/lightTheme";
import { useCookies } from "@src/hooks/useCookies";
import ShowIdentityPage from "@src/pages/account/logins/[type]/[id]";

enableFetchMocks();

jest.mock("@src/config", () => {
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
      userDocumentId: "ac3f358d-d2c9-487e-8387-2e6866b853c9",
    },
  };
});

describe("ShowIdentityPage", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  const nonPrimaryIdentity: Identity = {
    id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
    primary: false,
    status: "validated",
    type: ReceivedIdentityTypes.EMAIL,
    value: "test@test.test",
  };

  const primaryIdentity: Identity = {
    id: "6tf443c1-530b-4982-878d-33f0def6a7cf",
    primary: true,
    status: "validated",
    type: ReceivedIdentityTypes.EMAIL,
    value: "test4@test.test",
  };

  const nonValidatedIdentity: Identity = {
    id: "77yt43c1-530b-4982-878d-33f0def6a7cf",
    primary: false,
    status: "unvalidated",
    type: ReceivedIdentityTypes.EMAIL,
    value: "test6@test.test",
  };

  const phoneIdentity: Identity = {
    id: "81z343c1-530b-4982-878d-33f0def6a7cf",
    primary: false,
    status: "unvalidated",
    type: ReceivedIdentityTypes.PHONE,
    value: "0722443311",
  };

  test("it shoud display navigation breadcrumbs properly for emails", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <ShowIdentityPage identity={nonPrimaryIdentity} />
        </Layout>
      </ThemeProvider>,
    );

    const navigationBreadCrumbs = component.find(NavigationBreadcrumbs);
    expect(navigationBreadCrumbs).toHaveLength(1);

    expect(navigationBreadCrumbs.contains(<p>Email address</p>)).toEqual(true);
  });

  test("it shoud display navigation breadcrumbs properly for phones", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <ShowIdentityPage identity={phoneIdentity} />
        </Layout>
      </ThemeProvider>,
    );

    const navigationBreadCrumbs = component.find(NavigationBreadcrumbs);
    expect(navigationBreadCrumbs).toHaveLength(1);
    expect(navigationBreadCrumbs.contains(<p>Phone number</p>)).toEqual(true);
  });

  test("it should display the update button for a non primary identity", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <ShowIdentityPage identity={nonPrimaryIdentity} />
        </Layout>
      </ThemeProvider>,
    );

    const updateButton = component.contains(
      <Button variant={ButtonVariant.PRIMARY}>
        Update this email address
      </Button>,
    );
    expect(updateButton).toEqual(true);
  });

  test("it should display the update button for a primary identity", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <ShowIdentityPage identity={primaryIdentity} />
        </Layout>
      </ThemeProvider>,
    );

    const updateButton = component.contains(
      <Button variant={ButtonVariant.PRIMARY}>
        Update this email address
      </Button>,
    );
    expect(updateButton).toEqual(true);
  });

  test("it should display the delete button for a non primary identity", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <ShowIdentityPage identity={nonPrimaryIdentity} />
        </Layout>
      </ThemeProvider>,
    );

    const deleteButton = component
      .find(Button)
      .find({ variant: ButtonVariant.GHOST });
    expect(deleteButton).toHaveLength(1);
    expect(deleteButton.text()).toEqual("Delete this email address");
  });

  test("it should not display the delete button for a primary identity", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <ShowIdentityPage identity={primaryIdentity} />
        </Layout>
      </ThemeProvider>,
    );

    const deleteButton = component
      .find(Button)
      .find({ variant: ButtonVariant.GHOST });
    expect(deleteButton).toHaveLength(0);
  });

  test("it should not display the primary tag if the identity is not primary", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <ShowIdentityPage identity={nonPrimaryIdentity} />
        </Layout>
      </ThemeProvider>,
    );

    const primaryBadge = component.contains(<PrimaryBadge />);
    const makeThisPrimaryButton = component.contains(
      <Button variant={ButtonVariant.SECONDARY}>
        Make this my primary email
      </Button>,
    );
    expect(primaryBadge).toEqual(false);
    expect(makeThisPrimaryButton).toEqual(true);
  });

  test("it should display the primary tag if the identity is primary", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <ShowIdentityPage identity={primaryIdentity} />
        </Layout>
      </ThemeProvider>,
    );

    const makeThisPrimaryButton = component.contains(
      <Button variant={ButtonVariant.SECONDARY}>
        Make this my primary email
      </Button>,
    );
    const primaryBadge = component.contains(<PrimaryBadge />);
    const awaitingValidationBadge = component.contains(
      <AwaitingValidationBadge />,
    );
    expect(primaryBadge).toEqual(true);
    expect(awaitingValidationBadge).toEqual(false);
    expect(makeThisPrimaryButton).toEqual(false);
  });

  test("it should display the validation button and the awaiting validation tag if the identity is not validated", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <ShowIdentityPage identity={nonValidatedIdentity} />
        </Layout>
      </ThemeProvider>,
    );

    const awaitingValidationBadge = component.contains(
      <AwaitingValidationBadge />,
    );
    const validationButton = component.contains(
      <Button variant={ButtonVariant.PRIMARY}>proceed to validation</Button>,
    );
    expect(validationButton).toEqual(true);
    expect(awaitingValidationBadge).toEqual(true);
  });

  test("it should not display the make this identity primary button if the identity is not validated", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <ShowIdentityPage identity={nonValidatedIdentity} />
        </Layout>
      </ThemeProvider>,
    );

    const makeThisPrimaryButton = component.contains(
      <Button variant={ButtonVariant.SECONDARY}>
        Make this my primary email
      </Button>,
    );
    expect(makeThisPrimaryButton).toEqual(false);
  });
});
