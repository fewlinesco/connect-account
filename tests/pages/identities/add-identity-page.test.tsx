import { IdentityTypes } from "@fewlines/connect-management";
import userEvent from "@testing-library/user-event";
import React from "react";

import {
  render,
  screen,
  setRouterPathname,
} from "../../config/testing-library-config";
import * as locales from "@content/locales";
import AddIdentityPage from "@src/pages/account/logins/[type]/new";

jest.mock("@src/configs/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

describe("AddIdentityPage", () => {
  const path = "/account/logins/[type]/new";
  const localizedStrings = locales.en[path];

  beforeAll(() => {
    setRouterPathname(path);
  });

  describe("Identity type : EMAIL", () => {
    it("should render proper email form elements ", () => {
      expect.assertions(8);

      render(<AddIdentityPage type={IdentityTypes.EMAIL} />);

      const addIdentityInput = screen.getByRole("textbox");

      expect(addIdentityInput).toBeVisible();
      userEvent.type(addIdentityInput, "test@test.test");
      expect(addIdentityInput).toHaveDisplayValue("test@test.test");

      const markAsPrimaryCheckbox = screen.getByRole("checkbox", {
        name: localizedStrings.markIdentity,
      });

      expect(markAsPrimaryCheckbox).toBeInTheDocument();
      expect(markAsPrimaryCheckbox).not.toBeChecked();
      userEvent.click(markAsPrimaryCheckbox);
      expect(markAsPrimaryCheckbox).toBeChecked();

      expect(
        screen.getByRole("button", { name: localizedStrings.addEmail }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", { name: localizedStrings.cancel }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", { name: localizedStrings.cancel }),
      ).toHaveAttribute("href", "/account/logins");
    });
  });

  describe("Identity type : PHONE", () => {
    it("should render proper phone form elements ", () => {
      expect.assertions(8);

      render(<AddIdentityPage type={IdentityTypes.PHONE} />);

      const addIdentityInputComponent = screen.getByRole("textbox");
      expect(addIdentityInputComponent).toBeVisible();
      userEvent.type(addIdentityInputComponent, "0642424242");
      expect(addIdentityInputComponent).toHaveDisplayValue(["0642424242"]);

      const markAsPrimaryCheckbox = screen.getByRole("checkbox", {
        name: localizedStrings.markIdentity,
      });

      expect(markAsPrimaryCheckbox).toBeInTheDocument();
      expect(markAsPrimaryCheckbox).not.toBeChecked();
      userEvent.click(markAsPrimaryCheckbox);
      expect(markAsPrimaryCheckbox).toBeChecked();

      expect(
        screen.getByRole("button", { name: localizedStrings.addPhone }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", { name: localizedStrings.cancel }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", { name: localizedStrings.cancel }),
      ).toHaveAttribute("href", "/account/logins");
    });
  });
});
