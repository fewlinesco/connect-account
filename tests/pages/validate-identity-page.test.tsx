import userEvent from "@testing-library/user-event";
import React from "react";

import { render, screen } from "../config/testing-library-config";
import { IdentityTypes } from "@lib/@types/Identity";
import ValidateIdentityPage from "@src/pages/account/logins/[type]/validation/[eventId]";

jest.mock("@src/dbClient", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

const eventId = "foo";

const alertBarMessages = {
  email: "Confirmation email has been sent",
  phone: "Confirmation SMS has been sent",
};

describe("ValidateIdentityPage", () => {
  describe("Identity type : EMAIL", () => {
    it("should display proper email alert message", async () => {
      render(
        <ValidateIdentityPage type={IdentityTypes.EMAIL} eventId={eventId} />,
      );

      expect.assertions(3);

      expect(
        await screen.findByText(alertBarMessages.email),
      ).toBeInTheDocument();

      expect(await screen.findByTitle("Closing cross")).toBeInTheDocument();
      userEvent.click(screen.getByTitle("Closing cross"));

      expect(
        screen.queryByText(alertBarMessages.email),
      ).not.toBeInTheDocument();
    });

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
        screen.getByRole("button", { name: "Resend confirmation code" }),
      ).toBeInTheDocument();
    });

    it("should render proper email breadcrumbs", () => {
      render(
        <ValidateIdentityPage type={IdentityTypes.EMAIL} eventId={eventId} />,
      );

      expect(
        screen.getByText("Email address | validation"),
      ).toBeInTheDocument();
    });
  });

  describe("Identity type : PHONE", () => {
    it("should display proper phone alert message", async () => {
      render(
        <ValidateIdentityPage type={IdentityTypes.PHONE} eventId={eventId} />,
      );

      expect.assertions(3);

      expect(
        await screen.findByText(alertBarMessages.phone),
      ).toBeInTheDocument();

      expect(await screen.findByTitle("Closing cross")).toBeInTheDocument();
      userEvent.click(screen.getByTitle("Closing cross"));

      expect(
        screen.queryByText(alertBarMessages.phone),
      ).not.toBeInTheDocument();
    });

    it("should render proper phone form elements ", () => {
      render(
        <ValidateIdentityPage type={IdentityTypes.PHONE} eventId={eventId} />,
      );

      const validationCodeInput = screen.getByRole("textbox");
      expect(validationCodeInput).toBeVisible();
      userEvent.type(validationCodeInput, "424242");
      expect(validationCodeInput).toHaveDisplayValue("424242");

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
        screen.getByRole("button", { name: "Resend confirmation code" }),
      ).toBeInTheDocument();
    });

    it("should render proper phone breadcrumbs", () => {
      render(
        <ValidateIdentityPage type={IdentityTypes.PHONE} eventId={eventId} />,
      );

      expect(screen.getByText("Phone number | validation")).toBeInTheDocument();
    });
  });
});
