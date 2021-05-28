import { IdentityTypes } from "@fewlines/connect-management/dist/src/types";
import userEvent from "@testing-library/user-event";
import React from "react";

import { render, screen } from "../../config/testing-library-config";
import ValidateIdentityPage from "@src/pages/account/logins/[type]/validation/[eventId]";

jest.mock("@src/configs/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

const eventId = "foo";

describe("ValidateIdentityPage", () => {
  describe("Identity type : EMAIL", () => {
    it("should render proper email form elements ", () => {
      render(
        <ValidateIdentityPage type={IdentityTypes.EMAIL} eventId={eventId} />,
      );

      const validationCodeInput = screen.getByRole("textbox");
      expect(validationCodeInput).toBeVisible();
      userEvent.type(validationCodeInput, "424242");
      expect(validationCodeInput).toHaveDisplayValue("424242");

      expect(
        screen.getByRole("button", { name: "Confirm email" }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", { name: "Discard all changes" }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", { name: "Discard all changes" }),
      ).toHaveAttribute("href", "/account/logins");

      expect(
        screen.getByRole("button", { name: "Resend validation code" }),
      ).toBeInTheDocument();
    });

    it("should render proper email breadcrumbs", () => {
      render(
        <ValidateIdentityPage type={IdentityTypes.EMAIL} eventId={eventId} />,
      );

      expect(
        screen.getByRole("heading", { name: /email address \| validation/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Identity type : PHONE", () => {
    it("should render proper phone form elements ", () => {
      render(
        <ValidateIdentityPage type={IdentityTypes.PHONE} eventId={eventId} />,
      );

      const validationCodeInputComponent = screen.getByRole("textbox");
      expect(validationCodeInputComponent).toBeVisible();
      userEvent.type(validationCodeInputComponent, "424242");
      expect(validationCodeInputComponent).toHaveDisplayValue("424242");

      expect(
        screen.getByRole("button", { name: "Confirm phone" }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", { name: "Discard all changes" }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", { name: "Discard all changes" }),
      ).toHaveAttribute("href", "/account/logins");

      expect(
        screen.getByRole("button", { name: "Resend validation code" }),
      ).toBeInTheDocument();
    });

    it("should render proper phone breadcrumbs", () => {
      render(
        <ValidateIdentityPage type={IdentityTypes.PHONE} eventId={eventId} />,
      );

      expect(
        screen.getByRole("heading", { name: /phone number \| validation/i }),
      ).toBeInTheDocument();
    });
  });
});
