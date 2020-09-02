jest.mock("../../src/hooks/useCookies");

import { mount } from "enzyme";
import fetch from "jest-fetch-mock";
import { enableFetchMocks } from "jest-fetch-mock";
import React from "react";
import { ThemeProvider } from "styled-components";

import { ReceivedIdentityTypes, Identity } from "../../src/@types/Identity";
import { Layout } from "../../src/components/Layout";
import { UpdateInput, Form, Input } from "../../src/components/UpdateInput";
import { GlobalStyle } from "../../src/design-system/globals/globalStyle";
import { lightTheme } from "../../src/design-system/theme/lightTheme";
import { useCookies } from "../../src/hooks/useCookies";
import UpdateIdentity from "../../src/pages/account/logins/[type]/[id]/update";
import * as updateIdentity from "../../src/utils/updateIdentity";

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

  const nonPrimaryIdentity: Identity = {
    id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
    primary: false,
    status: "validated",
    type: ReceivedIdentityTypes.EMAIL,
    value: "test@test.test",
  };

  test("it should display an input", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <UpdateIdentity identity={nonPrimaryIdentity} />
        </Layout>
      </ThemeProvider>,
    );

    const updateInput = component.find(UpdateInput);
    expect(updateInput).toHaveLength(1);
  });

  test("it should submit the form", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <UpdateIdentity identity={nonPrimaryIdentity} />
        </Layout>
      </ThemeProvider>,
    );

    const updateInput = component.find(Form).find(Input);
    updateInput.simulate("change", {
      target: { value: "test2@test.test" },
    });

    const updateMethod = jest.spyOn(updateIdentity, "updateIdentity");
    const form = component.find(Form);
    form.simulate("submit");

    expect(updateMethod).toHaveBeenCalledWith(
      {
        type: "EMAIL",
        userId: "ac3f358d-d2c9-487e-8387-2e6866b853c9",
        value: "test2@test.test",
      },
      {
        type: "EMAIL",
        userId: "ac3f358d-d2c9-487e-8387-2e6866b853c9",
        value: "test@test.test",
      },
    );
  });
});
