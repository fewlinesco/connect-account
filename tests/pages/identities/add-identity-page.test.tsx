import { IdentityTypes } from "@fewlines/connect-management";
import userEvent from "@testing-library/user-event";
import React from "react";

import {
  render,
  screen,
  setRouterPathname,
} from "../../config/testing-library-config";
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
  describe("Identity type : EMAIL", () => {
    beforeAll(() => {
      setRouterPathname("/account/logins/email/new");
    });

    it("should render proper email breadcrumbs", async () => {
      expect.assertions(1);

      render(<AddIdentityPage type={IdentityTypes.EMAIL} />);

      expect(
        await screen.findByRole("heading", { name: /email address \| new/i }),
      ).toBeInTheDocument();
    });

    it("should render proper email form elements ", () => {
      expect.assertions(8);

      render(<AddIdentityPage type={IdentityTypes.EMAIL} />);

      const addIdentityInput = screen.getByRole("textbox");

      expect(addIdentityInput).toBeVisible();
      userEvent.type(addIdentityInput, "test@test.test");
      expect(addIdentityInput).toHaveDisplayValue("test@test.test");

      const markAsPrimaryCheckbox = screen.getByRole("checkbox", {
        name: "Mark this identity as my primary one",
      });

      expect(markAsPrimaryCheckbox).toBeInTheDocument();
      expect(markAsPrimaryCheckbox).not.toBeChecked();
      userEvent.click(markAsPrimaryCheckbox);
      expect(markAsPrimaryCheckbox).toBeChecked();

      expect(
        screen.getByRole("button", { name: "Add email" }),
      ).toBeInTheDocument();

      expect(screen.getByRole("link", { name: "Cancel" })).toBeInTheDocument();

      expect(screen.getByRole("link", { name: "Cancel" })).toHaveAttribute(
        "href",
        "/account/logins",
      );
    });
  });

  describe("Identity type : PHONE", () => {
    beforeAll(() => {
      setRouterPathname("/account/logins/phone/new");
    });

    it("should render proper email breadcrumbs", () => {
      expect.assertions(1);

      render(<AddIdentityPage type={IdentityTypes.PHONE} />);

      expect(
        screen.getByRole("heading", { name: /phone number \| new/i }),
      ).toBeInTheDocument();
    });

    it("should render proper phone form elements ", () => {
      expect.assertions(8);

      render(<AddIdentityPage type={IdentityTypes.PHONE} />);

      const addIdentityInputComponent = screen.getByRole("textbox");
      expect(addIdentityInputComponent).toBeVisible();
      userEvent.type(addIdentityInputComponent, "0642424242");
      expect(addIdentityInputComponent).toHaveDisplayValue(["06 42 42 42 42"]);

      const markAsPrimaryCheckbox = screen.getByRole("checkbox", {
        name: "Mark this identity as my primary one",
      });

      expect(markAsPrimaryCheckbox).toBeInTheDocument();
      expect(markAsPrimaryCheckbox).not.toBeChecked();
      userEvent.click(markAsPrimaryCheckbox);
      expect(markAsPrimaryCheckbox).toBeChecked();

      expect(
        screen.getByRole("button", { name: "Add phone" }),
      ).toBeInTheDocument();

      expect(screen.getByRole("link", { name: "Cancel" })).toBeInTheDocument();

      expect(screen.getByRole("link", { name: "Cancel" })).toHaveAttribute(
        "href",
        "/account/logins",
      );
    });
  });
});
