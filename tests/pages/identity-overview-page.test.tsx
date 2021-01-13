import userEvent from "@testing-library/user-event";
import React from "react";

import { render, screen } from "../config/testing-library-config";
import * as mockIdentities from "../mocks/identities";
import { Identity } from "@lib/@types";
import IdentityOverviewPage from "@src/pages/account/logins/[type]/[id]";

jest.mock("@src/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

function makeAsPrimaryRegExFactory(identity: Identity): RegExp {
  return new RegExp(
    "Make " + identity.value + " my primary " + identity.type.toLowerCase(),
  );
}

const userId = "ac3f358d-d2c9-487e-8387-2e6866b853c9";

describe("IdentityOverviewPage", () => {
  describe("Identity type: EMAIL", () => {
    it("should render proper email breadcrumbs", () => {
      render(
        <IdentityOverviewPage
          identity={mockIdentities.nonPrimaryEmailIdentity}
          userId={userId}
        />,
      );

      expect(screen.getByText("Email address")).toBeInTheDocument();
    });

    it("should display the relevant delete & mark as primary buttons but not validate identity one for a non primary validated email address", () => {
      render(
        <IdentityOverviewPage
          identity={mockIdentities.nonPrimaryEmailIdentity}
          userId={userId}
        />,
      );

      expect(
        screen.getByRole("button", {
          name: makeAsPrimaryRegExFactory(
            mockIdentities.nonPrimaryEmailIdentity,
          ),
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /Delete this email address/i }),
      ).toBeInTheDocument();

      userEvent.click(
        screen.getByRole("button", { name: /Delete this email address/i }),
      );

      expect(
        screen.queryByRole("link", { name: "Proceed to validation" }),
      ).not.toBeInTheDocument();
    });

    it("shouldn't display primary badge nor the awaiting validation one for a non primary validated email", () => {
      render(
        <IdentityOverviewPage
          identity={mockIdentities.nonPrimaryEmailIdentity}
          userId={userId}
        />,
      );

      expect(screen.queryByText("Primary")).not.toBeInTheDocument();
      expect(screen.queryByText("Awaiting validation")).not.toBeInTheDocument();
    });

    it("shouldn't display the delete, mark as primary & validate identity buttons for a primary email address", () => {
      render(
        <IdentityOverviewPage
          identity={mockIdentities.primaryEmailIdentity}
          userId={userId}
        />,
      );

      expect(
        screen.queryByRole("button", {
          name: makeAsPrimaryRegExFactory(mockIdentities.primaryEmailIdentity),
        }),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole("button", { name: /Delete this email address/i }),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole("link", { name: "Proceed to validation" }),
      ).not.toBeInTheDocument();
    });

    it("should display primary badge and not the awaiting validation one for a primary email", () => {
      render(
        <IdentityOverviewPage
          identity={mockIdentities.primaryEmailIdentity}
          userId={userId}
        />,
      );

      expect(screen.getByText("Primary")).toBeInTheDocument();
      expect(screen.queryByText("Awaiting validation")).not.toBeInTheDocument();
    });

    it("should display the delete & validate identity buttons but not mark as primary one for an unvalidated email address", () => {
      render(
        <IdentityOverviewPage
          identity={mockIdentities.unvalidatedEmailIdentity}
          userId={userId}
        />,
      );

      expect(
        screen.getByRole("link", { name: "Proceed to validation" }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", { name: "Proceed to validation" }),
      ).toHaveAttribute("href", "/account/logins/EMAIL/validation");

      expect(
        screen.getByRole("button", { name: /Delete this email address/i }),
      ).toBeInTheDocument();

      expect(
        screen.queryByRole("button", {
          name: makeAsPrimaryRegExFactory(
            mockIdentities.unvalidatedEmailIdentity,
          ),
        }),
      ).not.toBeInTheDocument();
    });

    it("should display the awaiting validation badge and not primary one for an unvalidated email", () => {
      render(
        <IdentityOverviewPage
          identity={mockIdentities.unvalidatedEmailIdentity}
          userId={userId}
        />,
      );

      expect(screen.getByText("Awaiting validation")).toBeInTheDocument();
      expect(screen.queryByText("Primary")).not.toBeInTheDocument();
    });
  });

  describe("Identity type: PHONE", () => {
    it("should render proper phone identity breadcrumbs", () => {
      render(
        <IdentityOverviewPage
          identity={mockIdentities.nonPrimaryPhoneIdentity}
          userId={userId}
        />,
      );

      expect(screen.getByText("Phone number")).toBeInTheDocument();
    });

    it("should display the relevant delete & mark as primary buttons but not validate identity one for a non primary validated phone number", () => {
      render(
        <IdentityOverviewPage
          identity={mockIdentities.nonPrimaryPhoneIdentity}
          userId={userId}
        />,
      );

      expect(
        screen.getByRole("button", {
          name: makeAsPrimaryRegExFactory(
            mockIdentities.nonPrimaryPhoneIdentity,
          ),
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /Delete this phone number/i }),
      ).toBeInTheDocument();

      expect(
        screen.queryByRole("link", { name: "Proceed to validation" }),
      ).not.toBeInTheDocument();
    });

    it("shouldn't display primary badge nor the awaiting validation one for a non primary validated phone number", () => {
      render(
        <IdentityOverviewPage
          identity={mockIdentities.nonPrimaryPhoneIdentity}
          userId={userId}
        />,
      );

      expect(screen.queryByText("Primary")).not.toBeInTheDocument();
      expect(screen.queryByText("Awaiting validation")).not.toBeInTheDocument();
    });

    it("shouldn't display the delete, mark as primary & validate identity buttons for a primary phone number", () => {
      render(
        <IdentityOverviewPage
          identity={mockIdentities.primaryPhoneIdentity}
          userId={userId}
        />,
      );

      expect(
        screen.queryByRole("button", {
          name: makeAsPrimaryRegExFactory(mockIdentities.primaryPhoneIdentity),
        }),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole("button", { name: /Delete this phone number/i }),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole("link", { name: "Proceed to validation" }),
      ).not.toBeInTheDocument();
    });

    it("should display primary badge and not the awaiting validation one for a primary phone number", () => {
      render(
        <IdentityOverviewPage
          identity={mockIdentities.primaryPhoneIdentity}
          userId={userId}
        />,
      );

      expect(screen.getByText("Primary")).toBeInTheDocument();
      expect(screen.queryByText("Awaiting validation")).not.toBeInTheDocument();
    });

    it("should display the delete & validate identity buttons but not mark as primary one for an unvalidated phone number", () => {
      render(
        <IdentityOverviewPage
          identity={mockIdentities.unvalidatedPhoneIdentity}
          userId={userId}
        />,
      );

      expect(
        screen.getByRole("link", { name: "Proceed to validation" }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /Delete this phone number/i }),
      ).toBeInTheDocument();

      expect(
        screen.queryByRole("button", {
          name: makeAsPrimaryRegExFactory(
            mockIdentities.unvalidatedPhoneIdentity,
          ),
        }),
      ).not.toBeInTheDocument();
    });

    it("should display the awaiting validation badge and not primary one for an unvalidated phone number", () => {
      render(
        <IdentityOverviewPage
          identity={mockIdentities.unvalidatedPhoneIdentity}
          userId={userId}
        />,
      );

      expect(screen.getByText("Awaiting validation")).toBeInTheDocument();
      expect(screen.queryByText("Primary")).not.toBeInTheDocument();
    });
  });
});
