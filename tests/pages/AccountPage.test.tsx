import { mount } from "enzyme";
import React from "react";

import {
  TextBox,
  Span,
} from "@src/components/display/fewlines/AccountOverview/AccountOverview";
import { AccountPage } from "@src/components/display/fewlines/AccountOverview/AccountOverview.stories";
import { H1 } from "@src/components/display/fewlines/H1/H1";
import { H2 } from "@src/components/display/fewlines/H2/H2";
import { ShadowBox } from "@src/components/display/fewlines/ShadowBox/ShadowBox";
import { AccountApp } from "@src/pages/_app";

describe("AccountPage", () => {
  test("it should display an H1 with the right text", () => {
    const component = mount(
      <AccountApp>
        <AccountPage />
      </AccountApp>,
    );
    const h1 = component.find(H1);
    expect(h1.text()).toEqual("Welcome to your account");
    expect(h1).toHaveLength(1);
  });

  test("it should display a SubTitle with the right text (user's full name)", () => {
    const component = mount(
      <AccountApp>
        <AccountPage />
      </AccountApp>,
    );
    const subTitle = component.find(H2);
    expect(subTitle.text()).toEqual("First name last name");
    expect(subTitle).toHaveLength(1);
  });

  test("it should display one Logins shadow box", () => {
    const component = mount(
      <AccountApp>
        <AccountPage />
      </AccountApp>,
    );
    const shadowBox = component.find(ShadowBox);
    expect(shadowBox).toHaveLength(1);

    const textBox = shadowBox.find(TextBox);

    expect(textBox.find(Span).text()).toEqual("LOGINS");
    expect(
      textBox.contains(
        <div>
          Manage your logins options, including emails, phone numbers and social
          logins
        </div>,
      ),
    ).toEqual(true);
  });
});
