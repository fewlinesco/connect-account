import { mount } from "enzyme";
import { execPath } from "process";
import React from "react";

import {
  TextBox,
  Span,
} from "@src/components/display/fewlines/Account/Account";
import { AccountPage } from "@src/components/display/fewlines/Account/Account.stories";
import { H1 } from "@src/components/display/fewlines/H1/H1";
import { H2 } from "@src/components/display/fewlines/H2/H2";
import { ShadowBox } from "@src/components/display/fewlines/ShadowBox/ShadowBox";
import { AccountApp } from "@src/pages/_app";

describe("AccountPage", () => {
  test("should display an H1 with the right text", () => {
    expect.assertions(2);

    const component = mount(
      <AccountApp>
        <AccountPage />
      </AccountApp>,
    );
    const h1 = component.find(H1);
    expect(h1.text()).toEqual("Welcome to your account");
    expect(h1).toHaveLength(1);
  });

  test("should display an H2 with the right text (user's full name)", () => {
    expect.assertions(2);

    const component = mount(
      <AccountApp>
        <AccountPage />
      </AccountApp>,
    );
    const h2 = component.find(H2);
    expect(h2.text()).toEqual("First name last name");
    expect(h2).toHaveLength(1);
  });

  test("should display each account section", () => {
    expect.assertions(5);

    const component = mount(
      <AccountApp>
        <AccountPage />
      </AccountApp>,
    );
    const shadowBoxes = component.find(ShadowBox);
    expect(shadowBoxes).toHaveLength(2);

    const accountSectionListName = ["LOGINS", "SECURITY"];
    const accountSectionListContent = [
      "Manage your logins options, including emails, phone numbers and social logins",
      "Set or change your password. You can check your connections history here,",
    ];

    shadowBoxes.forEach((shadowBox, index) => {
      const textBox = shadowBox.find(TextBox);

      expect(textBox.find(Span).text()).toEqual(accountSectionListName[index]);

      expect(
        textBox.contains(<div>{accountSectionListContent[index]}</div>),
      ).toEqual(true);
    });
  });
});
