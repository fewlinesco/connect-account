import { mount } from "enzyme";
import React from "react";

import { Input } from "@src/components/input/input";
import { ListItem } from "@src/components/locale/locale";
import { RadioButton } from "@src/components/radio-button/radio-button";
import { AccountApp } from "@src/pages/_app";
import LocalePage from "@src/pages/account/locale";

jest.mock("@src/config", () => {
  return {
    config: {
      connectApplicationClientSecret: "foo-bar",
      connectAccountSessionSalt: ".*b+x3ZXE3-h[E+Q5YC5`jr~y%CA~R-[",
    },
  };
});

jest.mock("@src/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

describe("LocalePage", () => {
  test("it shoud render an input", () => {
    const component = mount(
      <AccountApp>
        <LocalePage />
      </AccountApp>,
    );

    const input = component.find(Input);
    expect(input).toHaveLength(1);
  });

  test("it should render a list item with a checked radio button", () => {
    const component = mount(
      <AccountApp>
        <LocalePage />
      </AccountApp>,
    );

    const listItem = component.find(ListItem);
    const radioButton = component.find(RadioButton);
    const checkedRadioButton = component.contains(
      <RadioButton name="locale" checked={true} />,
    );

    expect(listItem).toHaveLength(1);
    expect(radioButton).toHaveLength(1);
    expect(checkedRadioButton).toEqual(true);
  });
});
