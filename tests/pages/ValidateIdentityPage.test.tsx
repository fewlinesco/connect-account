jest.mock("@src/hooks/useCookies");

import { mount } from "enzyme";
import { enableFetchMocks } from "jest-fetch-mock";
import React from "react";

import { IdentityTypes } from "@lib/@types/Identity";
import AlertBar from "@src/components/display/fewlines/AlertBar/AlertBar";
import { Button } from "@src/components/display/fewlines/Button/Button";
import { Form } from "@src/components/display/fewlines/Form/Form";
import { Input } from "@src/components/display/fewlines/Input/Input";
import {
  NavigationBreadcrumbs,
  Breadcrumbs,
} from "@src/components/display/fewlines/NavigationBreadcrumbs/NavigationBreadcrumbs";
import ValidateIdentityForm from "@src/components/display/fewlines/ValidateIdentityForm/ValidateIdentityForm";
import { useCookies } from "@src/hooks/useCookies";
import { AccountApp } from "@src/pages/_app";
import ValidateIdentityPage from "@src/pages/account/logins/[type]/validation/[eventId]";
import * as fetchJson from "@src/utils/fetchJson";

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
      userSub: "ac3f358d-d2c9-487e-8387-2e6866b853c9",
    },
  };
});

describe("ValidateIdentityPage", () => {
  const eventId = "foo";

  test("it should display navigation breadcrumbs properly for emails", () => {
    const component = mount(
      <AccountApp>
        <ValidateIdentityPage type={IdentityTypes.EMAIL} eventId={eventId} />
      </AccountApp>,
    );

    const navigationBreadCrumbs = component.find(NavigationBreadcrumbs);
    expect(navigationBreadCrumbs).toHaveLength(1);
    expect(
      navigationBreadCrumbs.contains(
        <Breadcrumbs>Email address | validation</Breadcrumbs>,
      ),
    ).toEqual(true);
  });

  test("it should display navigation breadcrumbs properly for phones", () => {
    const component = mount(
      <AccountApp>
        <ValidateIdentityPage type={IdentityTypes.PHONE} eventId={eventId} />
      </AccountApp>,
    );

    const navigationBreadCrumbs = component.find(NavigationBreadcrumbs);
    expect(navigationBreadCrumbs).toHaveLength(1);
    expect(
      navigationBreadCrumbs.contains(
        <Breadcrumbs>Phone number | validation</Breadcrumbs>,
      ),
    ).toEqual(true);
  });

  test("it should display an input ans 3 buttons for emails", () => {
    const component = mount(
      <AccountApp>
        <ValidateIdentityPage type={IdentityTypes.EMAIL} eventId={eventId} />
      </AccountApp>,
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

  test("it should display properly an input and 3 buttons for phones", () => {
    const component = mount(
      <AccountApp>
        <ValidateIdentityPage type={IdentityTypes.PHONE} eventId={eventId} />
      </AccountApp>,
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
      <AccountApp>
        <ValidateIdentityPage type={IdentityTypes.PHONE} eventId={eventId} />
      </AccountApp>,
    );

    const alertBar = component.find(AlertBar);

    expect(alertBar).toHaveLength(1);
    expect(alertBar.text()).toEqual("confirmation SMS has been sent");
  });

  test("it should display an alert bar with the correct message for emails", () => {
    const component = mount(
      <AccountApp>
        <ValidateIdentityPage type={IdentityTypes.EMAIL} eventId={eventId} />
      </AccountApp>,
    );

    const alertBar = component.find(AlertBar);

    expect(alertBar).toHaveLength(1);
    expect(alertBar.text()).toEqual("Confirmation email has been sent");
  });

  test("it should call `send-identity-validation-code` API page on submit", () => {
    const component = mount(
      <AccountApp>
        <ValidateIdentityPage type={IdentityTypes.EMAIL} eventId={eventId} />
      </AccountApp>,
    );

    const verifyIdentityInput = component
      .find(ValidateIdentityForm)
      .find(Input);

    const validationCode = "42";

    verifyIdentityInput.simulate("change", {
      target: { value: validationCode },
    });

    const form = component.find(ValidateIdentityForm).find(Form);

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
