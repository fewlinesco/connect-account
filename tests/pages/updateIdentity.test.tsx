jest.mock("../../src/hooks/useCookies");

import { mount } from "enzyme";
import fetch from "jest-fetch-mock";
import { enableFetchMocks } from "jest-fetch-mock";
import React from "react";
import { ThemeProvider } from "styled-components";

import { ReceivedIdentityTypes, Identity } from "../../src/@types/Identity";
import { Layout } from "../../src/components/Layout";
import {
  UpdateIdentityForm,
  Form,
  Input,
} from "../../src/components/display/fewlines/UpdateIdentityForm";
import { GlobalStyle } from "../../src/design-system/globals/globalStyle";
import { lightTheme } from "../../src/design-system/theme/lightTheme";
import { useCookies } from "../../src/hooks/useCookies";
import UpdateIdentityPage from "../../src/pages/account/logins/[type]/[id]/update";
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

(useCookies as any).mockImplementation(() => {
  return {
    data: {
      userId: "ac3f358d-d2c9-487e-8387-2e6866b853c9",
    },
  };
});

describe("UpdateIdentityPage", () => {
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

  test("it should display an update identity input", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <UpdateIdentityPage identity={nonPrimaryIdentity} />
        </Layout>
      </ThemeProvider>,
    );

    const updateIdentityInput = component.find(UpdateIdentityForm).find(Input);
    expect(updateIdentityInput).toHaveLength(1);
  });

  test("it should submit the update identity form", () => {
    const component = mount(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <UpdateIdentityPage identity={nonPrimaryIdentity} />
        </Layout>
      </ThemeProvider>,
    );

    const updateInput = component.find(UpdateIdentityPage).find(Input);
    updateInput.simulate("change", {
      target: { value: "test2@test.test" },
    });

    const createMethod = jest.spyOn(fetchJson, "fetchJson");
    const form = component.find(UpdateIdentityForm).find(Form);
    form.simulate("submit");

    expect(createMethod).toHaveBeenCalledWith("/api/account", "POST", {
      type: "EMAIL",
      userId: "ac3f358d-d2c9-487e-8387-2e6866b853c9",
      value: "test2@test.test",
    });
  });
});
