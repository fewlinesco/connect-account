jest.mock("@src/hooks/useCookies");

import { mount } from "enzyme";
import { enableFetchMocks } from "jest-fetch-mock";
import React from "react";

<<<<<<< HEAD
import { ReceivedIdentityTypes } from "@src/@types/Identity";
=======
import { IdentityTypes } from "@lib/@types";
import { Layout } from "@src/components/Layout";
>>>>>>> deleting src types identity file
import { Form } from "@src/components/display/fewlines/AddIdentityForm/AddIdentityForm";
import { Input } from "@src/components/display/fewlines/Input/Input";
import {
  NavigationBreadcrumbs,
  Breadcrumbs,
} from "@src/components/display/fewlines/NavigationBreadcrumbs/NavigationBreadcrumbs";
import { useCookies } from "@src/hooks/useCookies";
import { AccountApp } from "@src/pages/_app";
import AddIdentityPage from "@src/pages/account/logins/[type]/new";
import * as fetchJson from "@src/utils/fetchJson";

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
      userSub: "ac3f358d-d2c9-487e-8387-2e6866b853c9",
    },
  };
});

describe("AddIdentityPage", () => {
  test("it should display navigation breadcrumbs properly for emails", () => {
    const component = mount(
<<<<<<< HEAD
      <AccountApp>
        <AddIdentityPage type={ReceivedIdentityTypes.EMAIL} />
      </AccountApp>,
=======
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <AddIdentityPage type={IdentityTypes.EMAIL} />
        </Layout>
      </ThemeProvider>,
>>>>>>> deleting src types identity file
    );

    const navigationBreadCrumbs = component.find(NavigationBreadcrumbs);
    expect(navigationBreadCrumbs).toHaveLength(1);
    expect(
      navigationBreadCrumbs.contains(
        <Breadcrumbs>Email address | new</Breadcrumbs>,
      ),
    ).toEqual(true);
  });

  test("it should display navigation breadcrumbs properly for phones", () => {
    const component = mount(
<<<<<<< HEAD
      <AccountApp>
        <AddIdentityPage type={ReceivedIdentityTypes.PHONE} />
      </AccountApp>,
=======
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <AddIdentityPage type={IdentityTypes.PHONE} />
        </Layout>
      </ThemeProvider>,
>>>>>>> deleting src types identity file
    );

    const navigationBreadCrumbs = component.find(NavigationBreadcrumbs);
    expect(navigationBreadCrumbs).toHaveLength(1);
    expect(
      navigationBreadCrumbs.contains(
        <Breadcrumbs>Phone number | new</Breadcrumbs>,
      ),
    ).toEqual(true);
  });

  test("it should display an input", () => {
    const component = mount(
<<<<<<< HEAD
      <AccountApp>
        <AddIdentityPage type={ReceivedIdentityTypes.EMAIL} />
      </AccountApp>,
=======
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <AddIdentityPage type={IdentityTypes.EMAIL} />
        </Layout>
      </ThemeProvider>,
>>>>>>> deleting src types identity file
    );

    const addIdentityInput = component.find(Form);
    expect(addIdentityInput).toHaveLength(1);
  });

  test("it should call `send-identity-validation-code` API page on submit", () => {
    const spyDate = jest.spyOn(Date, "now").mockReturnValue(1572393600000);

    const component = mount(
<<<<<<< HEAD
      <AccountApp>
        <AddIdentityPage type={ReceivedIdentityTypes.EMAIL} />
      </AccountApp>,
=======
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <AddIdentityPage type={IdentityTypes.EMAIL} />
        </Layout>
      </ThemeProvider>,
>>>>>>> deleting src types identity file
    );

    const newIdentityInput = component.find(Input);

    newIdentityInput.simulate("change", {
      target: { value: "test3@test.test " },
    });

    const form = component.find(Form);

    const fetchJsonMethod = jest.spyOn(fetchJson, "fetchJson");

    form.simulate("submit");

    expect(fetchJsonMethod).toHaveBeenCalledWith(
      "/api/auth-connect/send-identity-validation-code",
      "POST",
      {
        callbackUrl: "/",
        identityInput: {
          expiresAt: 1572393600000 + 300,
          type: IdentityTypes.EMAIL,
          value: "test3@test.test ",
        },
      },
    );

    spyDate.mockRestore();
  });
});
