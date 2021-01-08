import { mount } from "enzyme";
import React from "react";

import { SECTION_LIST_CONTENT } from "@src/components/account-overview/account-overview";
import {
  TextBox,
  SectionName,
} from "@src/components/display/fewlines/SectionListItem/SectionListItem";
import { ShadowBox } from "@src/components/display/fewlines/ShadowBox/ShadowBox";
import { AccountApp } from "@src/pages/_app";
import AccountPage, { WelcomeMessage } from "@src/pages/account/index";

jest.mock("@src/dbClient", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

describe("AccountPage", () => {
  test("should display an H1 with the right text", () => {
    expect.assertions(2);

    const component = mount(
      <AccountApp>
        <AccountPage />
      </AccountApp>,
    );
    const welcomeMessage = component.find(WelcomeMessage);
    expect(welcomeMessage.text()).toEqual("Welcome to your account");
    expect(welcomeMessage).toHaveLength(1);
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

    shadowBoxes.forEach((shadowBox, index) => {
      const textBox = shadowBox.find(TextBox);
      const [sectionName, { text }] = Object.entries(SECTION_LIST_CONTENT)[
        index
      ];

      expect(textBox.find(SectionName).text()).toEqual(sectionName);
      expect(textBox.contains(text)).toEqual(true);
    });
  });
});
