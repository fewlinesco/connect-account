jest.mock("../../src/hooks/useCookies");

import { mount } from "enzyme";
import { enableFetchMocks } from "jest-fetch-mock";
import React from "react";
import { ThemeProvider } from "styled-components";

import { IdentityTypes } from "@lib/@types/Identity";
import { Layout } from "@src/components/Layout";
import IdentityValidationForm, {
  Form,
} from "@src/components/display/fewlines/IdentityValidationForm";
import { Input } from "@src/components/display/fewlines/Input/Input";
import { GlobalStyle } from "@src/design-system/globals/globalStyle";
import { lightTheme } from "@src/design-system/theme/lightTheme";
import { useCookies } from "@src/hooks/useCookies";
import IdentityValidation from "@src/pages/account/logins/[type]/validation/[eventId]";
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

const eventId = "foo";

describe("IdentityValidationForm", () => {
  test("it should display an input", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <IdentityValidation type={IdentityTypes.EMAIL} eventId={eventId} />
        </Layout>
      </ThemeProvider>,
    );

    const addIdentityInput = component.find(IdentityValidationForm).find(Form);
    expect(addIdentityInput).toHaveLength(1);
  });

  test("it should call `send-identity-validation-code` API page on submit", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <IdentityValidation type={IdentityTypes.EMAIL} eventId={eventId} />
        </Layout>
      </ThemeProvider>,
    );

    const verifyIdentityInput = component
      .find(IdentityValidationForm)
      .find(Input);

    const validationCode = "42";

    verifyIdentityInput.simulate("change", {
      target: { value: validationCode },
    });

    const form = component.find(IdentityValidationForm).find(Form);

    const fetchJsonMethod = jest.spyOn(fetchJson, "fetchJson");

    form.simulate("submit");

    expect(fetchJsonMethod).toHaveBeenCalledWith(
      "/api/auth-connect/verify-validation-code",
      "POST",
      {
        validationCode,
        eventId,
      },
    );
  });
});
