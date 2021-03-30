import { IdentityTypes } from "@fewlines/connect-management";
import userEvent from "@testing-library/user-event";
import React from "react";

import { render, screen } from "../config/testing-library-config";
import AddIdentityPage from "@src/pages/account/logins/[type]/new";

jest.mock("@src/config/db-client", () => {
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
    it("should render proper email breadcrumbs", () => {
      render(<AddIdentityPage type={IdentityTypes.EMAIL} />);

      expect(screen.getByText("Email address | new")).toBeInTheDocument();
    });

    it("should render proper email form elements ", () => {
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
    it("should render proper email breadcrumbs", () => {
      render(<AddIdentityPage type={IdentityTypes.PHONE} />);

      expect(screen.getByText("Phone number | new")).toBeInTheDocument();
    });

    it("should render proper phone form elements ", () => {
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
