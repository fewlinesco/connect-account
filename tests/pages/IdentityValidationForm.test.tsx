jest.mock("../../src/hooks/useCookies");

import { mount } from "enzyme";
import { enableFetchMocks } from "jest-fetch-mock";
import React from "react";
import { ThemeProvider } from "styled-components";

import { IdentityTypes } from "@src/@types/Identity";
import { Layout } from "@src/components/Layout";
import AlertBar from "@src/components/display/fewlines/AlertBar";
import { Button } from "@src/components/display/fewlines/Button/Button";
import IdentityValidationForm from "@src/components/display/fewlines/IdentityValidationForm";
import { Input } from "@src/components/display/fewlines/Input/Input";
import { GlobalStyle } from "@src/design-system/globals/globalStyle";
import { lightTheme } from "@src/design-system/theme/lightTheme";
import { useCookies } from "@src/hooks/useCookies";

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

describe("IdentityValidationForm", () => {
  test("it should display an input ans 3 buttons properly for emails", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <IdentityValidationForm type={IdentityTypes.EMAIL} />
        </Layout>
      </ThemeProvider>,
    );

    const validationCodeInput = component
      .find(Input)
      .find({ placeholder: "012345" })
      .hostNodes();
    const buttons = component.find(Button);
    expect(validationCodeInput).toHaveLength(1);
    expect(buttons).toHaveLength(3);
    expect(buttons.at(0).text()).toEqual("Confirm email");
    expect(buttons.at(1).text()).toEqual("Discard all changes");
    expect(buttons.at(2).text()).toEqual("Resend confirmation code");
  });

  test("it should display an input ans 3 buttons properly for phones", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <IdentityValidationForm type={IdentityTypes.PHONE} />
        </Layout>
      </ThemeProvider>,
    );

    const validationCodeInput = component
      .find(Input)
      .find({ placeholder: "012345" })
      .hostNodes();
    const buttons = component.find(Button);
    expect(validationCodeInput).toHaveLength(1);
    expect(buttons).toHaveLength(3);
    expect(buttons.at(0).text()).toEqual("Confirm phone");
    expect(buttons.at(1).text()).toEqual("Discard all changes");
    expect(buttons.at(2).text()).toEqual("Resend confirmation code");
  });

  test("it should display an alert bar with the correct message for phones", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <IdentityValidationForm type={IdentityTypes.PHONE} />
        </Layout>
      </ThemeProvider>,
    );

    const alertBar = component.find(AlertBar);

    expect(alertBar).toHaveLength(1);
    expect(alertBar.text()).toEqual("confirmation SMS has been sent");
  });

  test("it should display an alert bar with the correct message for emails", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <IdentityValidationForm type={IdentityTypes.EMAIL} />
        </Layout>
      </ThemeProvider>,
    );

    const alertBar = component.find(AlertBar);

    expect(alertBar).toHaveLength(1);
    expect(alertBar.text()).toEqual("Confirmation email has been sent");
  });
});
