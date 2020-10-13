import { mount } from "enzyme";
import React from "react";

import {
  Button,
  ButtonVariant,
} from "@src/components/display/fewlines/Button/Button";
import { BackLink } from "@src/components/display/fewlines/Home/Home";
import HomePage from "@src/pages";
import { AccountApp } from "@src/pages/_app";

describe("HomePage", () => {
  test("it should display a button which redirects to Connect", () => {
    const component = mount(
      <AccountApp>
        <HomePage authorizeURL="#" />
      </AccountApp>,
    );

    const accountButton = component
      .find(Button)
      .find({ variant: ButtonVariant.PRIMARY });

    expect(accountButton).toHaveLength(1);
    expect(accountButton.text()).toEqual("Access my account");
  });

  test("it should display a BackLink to fewlines.co", () => {
    const component = mount(
      <AccountApp>
        <HomePage authorizeURL="#" />
      </AccountApp>,
    );

    const backLink = component.find(BackLink);
    expect(backLink).toHaveLength(1);
    expect(backLink.text()).toEqual("Go back to fewlines.co");
  });
});
