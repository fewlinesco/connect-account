import { mount } from "enzyme";
import React from "react";

import { ButtonVariant } from "@src/components/display/fewlines/Button/Button";
import { AccessButton } from "@src/components/display/fewlines/Home/Home";
import HomePage from "@src/pages";
import { AccountApp } from "@src/pages/_app";

describe("HomePage", () => {
  test("it should display a button which redirects to Connect", () => {
    const component = mount(
      <AccountApp>
        <HomePage authorizeURL="#" providerName="Fewlines" />
      </AccountApp>,
    );

    const accountAccessButton = component
      .find(AccessButton)
      .find({ variant: ButtonVariant.PRIMARY });

    expect(accountAccessButton).toHaveLength(1);
    expect(accountAccessButton.text()).toEqual("Access my account");
  });
});
