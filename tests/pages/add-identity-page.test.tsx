import { mount } from "enzyme";
import { enableFetchMocks } from "jest-fetch-mock";
import React from "react";

import { IdentityTypes } from "@lib/@types";
import { Button, ButtonVariant } from "@src/components/button/button";
import {
  NavigationBreadcrumbs,
  Breadcrumbs,
} from "@src/components/display/fewlines/navigation-breadcrumbs/navigation-breadcrumbs";
import { FakeButton } from "@src/components/fake-button/fake-button";
import { Form } from "@src/components/form/form";
import { Input } from "@src/components/input/input";
import { AccountApp } from "@src/pages/_app";
import AddIdentityPage from "@src/pages/account/logins/[type]/new";
import * as fetchJson from "@src/utils/fetch-json";

enableFetchMocks();

jest.mock("../../src/config", () => {
  return {
    config: {
      connectApplicationClientSecret: "foo-bar",
      connectAccountSessionSalt: ".*b+x3ZXE3-h[E+Q5YC5`jr~y%CA~R-[",
    },
  };
});

jest.mock("@src/dbClient", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

describe("AddIdentityPage", () => {
  test("it should display navigation breadcrumbs properly for emails", () => {
    const component = mount(
      <AccountApp>
        <AddIdentityPage type={IdentityTypes.EMAIL} />
      </AccountApp>,
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
      <AccountApp>
        <AddIdentityPage type={IdentityTypes.PHONE} />
      </AccountApp>,
    );

    const navigationBreadCrumbs = component.find(NavigationBreadcrumbs);
    expect(navigationBreadCrumbs).toHaveLength(1);
    expect(
      navigationBreadCrumbs.contains(
        <Breadcrumbs>Phone number | new</Breadcrumbs>,
      ),
    ).toEqual(true);
  });

  test("it should display the form properly for emails", () => {
    const component = mount(
      <AccountApp>
        <AddIdentityPage type={IdentityTypes.EMAIL} />
      </AccountApp>,
    );

    const addIdentityInput = component
      .find(Form)
      .find(Input)
      .find('[type="email"]')
      .hostNodes();
    expect(addIdentityInput).toHaveLength(1);
    expect(addIdentityInput.props().placeholder).toEqual("Enter your email");

    const markAsPrimaryCheckbox = component
      .find(Form)
      .find(Input)
      .find('[type="checkbox"]')
      .hostNodes();
    expect(markAsPrimaryCheckbox).toHaveLength(1);

    const addButton = component
      .find(Form)
      .find(Button)
      .find({ variant: ButtonVariant.PRIMARY });

    const cancelButton = component
      .find(FakeButton)
      .find({ variant: ButtonVariant.SECONDARY, as: "div" });

    expect(addButton).toHaveLength(1);
    expect(addButton.text()).toEqual("Add email");
    expect(cancelButton).toHaveLength(1);
    expect(cancelButton.text()).toEqual("Cancel");
  });

  test("it should display the form properly for phones", () => {
    const component = mount(
      <AccountApp>
        <AddIdentityPage type={IdentityTypes.PHONE} />
      </AccountApp>,
    );

    const addIdentityInput = component
      .find(Form)
      .find(Input)
      .find('[type="text"]')
      .hostNodes();
    expect(addIdentityInput).toHaveLength(1);
    expect(addIdentityInput.props().placeholder).toEqual("Enter your phone");

    const markAsPrimaryCheckbox = component
      .find(Form)
      .find(Input)
      .find('[type="checkbox"]')
      .hostNodes();
    expect(markAsPrimaryCheckbox).toHaveLength(1);

    const addButton = component
      .find(Form)
      .find(Button)
      .find({ variant: ButtonVariant.PRIMARY });

    const cancelButton = component
      .find(FakeButton)
      .find({ variant: ButtonVariant.SECONDARY, as: "div" });

    expect(addButton).toHaveLength(1);
    expect(addButton.text()).toEqual("Add phone");
    expect(cancelButton).toHaveLength(1);
    expect(cancelButton.text()).toEqual("Cancel");
  });

  test("it should call `send-identity-validation-code` API page on submit", () => {
    const spyDate = jest.spyOn(Date, "now").mockReturnValue(1572393600000);

    const component = mount(
      <AccountApp>
        <AddIdentityPage type={IdentityTypes.EMAIL} />
      </AccountApp>,
    );

    const newIdentityInput = component
      .find(Input)
      .find('[type="email"]')
      .hostNodes();

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
          expiresAt: 1572393600000 + 300000,
          primary: false,
          type: IdentityTypes.EMAIL,
          value: "test3@test.test ",
        },
      },
    );

    spyDate.mockRestore();
  });
});
