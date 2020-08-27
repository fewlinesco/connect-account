jest.mock("../../src/hooks/useCookies");

import { mount } from "enzyme";
import fetch from "jest-fetch-mock";
import { enableFetchMocks } from "jest-fetch-mock";
import React from "react";
import { ThemeProvider } from "styled-components";

import { ReceivedIdentityTypes, Identity } from "../../src/@types/Identity";
import { Layout } from "../../src/components/Layout";
import { DeleteButton } from "../../src/components/display/fewlines/DeleteButton";
import { GlobalStyle } from "../../src/design-system/globals/globalStyle";
import { EditIcon } from "../../src/design-system/icons/EditIcon";
import { lightTheme } from "../../src/design-system/theme/lightTheme";
import { useCookies } from "../../src/hooks/useCookies";
import ShowIdentity from "../../src/pages/account/logins/[type]/[id]";

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

describe("identity should be displayed properly", () => {
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

  test("it should display the update button for a non primary identity", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <ShowIdentity identity={nonPrimaryIdentity} />
        </Layout>
      </ThemeProvider>,
    );

    const updateButton = component.find(EditIcon);
    expect(updateButton).toHaveLength(1);
  });

  test("it should display the update button for a primary identity", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <ShowIdentity identity={primaryIdentity} />
        </Layout>
      </ThemeProvider>,
    );

    const updateButton = component.find(EditIcon);
    expect(updateButton).toHaveLength(1);
  });

  //   test("update button should redirect to update page", () => {});

  test("it should display the delete button for a non primary identity", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <ShowIdentity identity={nonPrimaryIdentity} />
        </Layout>
      </ThemeProvider>,
    );

    const deleteButton = component.find(DeleteButton);
    expect(deleteButton).toHaveLength(1);
  });

  test("it should not display the delete button for a primary identity", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <ShowIdentity identity={primaryIdentity} />
        </Layout>
      </ThemeProvider>,
    );

    const deleteButton = component.find(DeleteButton);
    expect(deleteButton).toHaveLength(0);
  });
});
