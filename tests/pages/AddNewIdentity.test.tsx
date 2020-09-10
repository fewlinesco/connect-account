import { mount } from "enzyme";
import { enableFetchMocks } from "jest-fetch-mock";
import React from "react";
import { ThemeProvider } from "styled-components";

import { IdentityTypes } from "../../src/@types/Identity";
import { Layout } from "../../src/components/Layout";
import {
  AddIdentityInputForm,
  Input,
  Form,
} from "../../src/components/display/fewlines/AddIdentityInputForm";
import { GlobalStyle } from "../../src/design-system/globals/globalStyle";
import { lightTheme } from "../../src/design-system/theme/lightTheme";
import AddNewIdentity from "../../src/pages/account/logins/[type]/new";
import * as fetchJson from "../../src/utils/fetchJson";

enableFetchMocks();

jest.mock("../../src/config", () => {
  return {
    config: {
      connectApplicationClientSecret: "foo-bar",
      connectAccountSessionSalt: ".*b+x3ZXE3-h[E+Q5YC5`jr~y%CA~R-[",
    },
  };
});

describe("AddNewIdentity", () => {
  test("it should display an input", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <AddNewIdentity type={IdentityTypes.EMAIL} />
        </Layout>
      </ThemeProvider>,
    );

    const addIdentityInput = component.find(AddNewIdentity).find(Form);
    expect(addIdentityInput).toHaveLength(1);
  });

  test("it should submit the form", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <AddNewIdentity type={IdentityTypes.EMAIL} />
        </Layout>
      </ThemeProvider>,
    );

    const newIdentityInput = component.find(AddIdentityInputForm).find(Input);
    newIdentityInput.simulate("change", {
      target: { value: "test3@test.test " },
    });
    const form = component.find(AddIdentityInputForm).find(Form);
    const fetchJsonMethod = jest.spyOn(fetchJson, "fetchJson");
    form.simulate("submit");

    expect(fetchJsonMethod).toHaveBeenCalledWith(
      "/api/send-identity-validation-code",
      "POST",
      {
        callbackUrl: "/",
        type: "EMAIL",
        value: "test3@test.test ",
      },
    );
  });
});
