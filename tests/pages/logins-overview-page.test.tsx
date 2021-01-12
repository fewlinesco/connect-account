import userEvent from "@testing-library/user-event";
import React from "react";

import { render, screen } from "../config/testing-library-config";
import * as mockIdentities from "../mocks/identities";
import { SortedIdentities } from "@src/@types/sorted-identities";
import LoginsOverviewPage from "@src/pages/account/logins";

jest.mock("@src/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

jest.mock("@src/utils/get-flash-message", () => {
  return {
    getFlashMessage: jest.fn().mockImplementation(() => {
      return "Email address has been deleted";
    }),
  };
});

describe("LoginsOverviewPage", () => {
  describe("Identity type: EMAIL", () => {
    it("should display primary email identity first and all of them when clicking on the show more button", () => {
      const sortedIdentities: SortedIdentities = {
        emailIdentities: [
          mockIdentities.primaryEmailIdentity,
          mockIdentities.nonPrimaryEmailIdentity,
        ],
        phoneIdentities: [],
        socialIdentities: [],
      };

      render(<LoginsOverviewPage sortedIdentities={sortedIdentities} />);

      expect(
        screen.getByRole("link", {
          name: mockIdentities.primaryEmailIdentity.value,
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", {
          name: mockIdentities.primaryEmailIdentity.value,
        }),
      ).toHaveAttribute(
        "href",
        `/account/logins/${mockIdentities.primaryEmailIdentity.type.toLowerCase()}/${
          mockIdentities.primaryEmailIdentity.id
        }`,
      );

      expect(
        screen.queryByRole("link", {
          name: mockIdentities.nonPrimaryEmailIdentity.value,
        }),
      ).not.toBeInTheDocument();

      userEvent.click(
        screen.getByText(
          `Show ${sortedIdentities.emailIdentities.length - 1} more`,
        ),
      );

      expect(
        screen.getByRole("link", {
          name: mockIdentities.primaryEmailIdentity.value,
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", {
          name: mockIdentities.nonPrimaryEmailIdentity.value,
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", {
          name: mockIdentities.nonPrimaryEmailIdentity.value,
        }),
      ).toHaveAttribute(
        "href",
        `/account/logins/${mockIdentities.nonPrimaryEmailIdentity.type.toLowerCase()}/${
          mockIdentities.nonPrimaryEmailIdentity.id
        }`,
      );

      expect(
        screen.getByRole("link", { name: "+ add new email address" }),
      ).toBeInTheDocument();
    });

    it("should display primary email identity without show more button if provided 1 identity", () => {
      const sortedIdentities: SortedIdentities = {
        emailIdentities: [mockIdentities.primaryEmailIdentity],
        phoneIdentities: [],
        socialIdentities: [],
      };

      render(<LoginsOverviewPage sortedIdentities={sortedIdentities} />);

      expect(
        screen.getByRole("link", {
          name: mockIdentities.primaryEmailIdentity.value,
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", {
          name: mockIdentities.primaryEmailIdentity.value,
        }),
      ).toHaveAttribute(
        "href",
        `/account/logins/${mockIdentities.primaryEmailIdentity.type.toLowerCase()}/${
          mockIdentities.primaryEmailIdentity.id
        }`,
      );

      expect(screen.queryByText(/Show [0-9]+ more/i)).not.toBeInTheDocument();

      expect(
        screen.getByRole("link", { name: "+ add new email address" }),
      ).toBeInTheDocument();
    });

    it("should display default message when no identity is provided", () => {
      const sortedIdentities: SortedIdentities = {
        emailIdentities: [],
        phoneIdentities: [],
        socialIdentities: [],
      };

      render(<LoginsOverviewPage sortedIdentities={sortedIdentities} />);

      expect(screen.getByText("No email added yet.")).toBeInTheDocument();
      expect(screen.queryByText(/Show [0-9]+ more/i)).not.toBeInTheDocument();

      expect(
        screen.getByRole("link", { name: "+ add new phone number" }),
      ).toBeInTheDocument();
    });
  });

  describe("Identity type: PHONE", () => {
    it("should display primary phone identity first and all of them when clicking on the show more button", () => {
      const sortedIdentities: SortedIdentities = {
        emailIdentities: [],
        phoneIdentities: [
          mockIdentities.primaryPhoneIdentity,
          mockIdentities.nonPrimaryPhoneIdentity,
        ],
        socialIdentities: [],
      };

      render(<LoginsOverviewPage sortedIdentities={sortedIdentities} />);

      expect(
        screen.getByRole("link", {
          name: mockIdentities.primaryPhoneIdentity.value,
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", {
          name: mockIdentities.primaryPhoneIdentity.value,
        }),
      ).toHaveAttribute(
        "href",
        `/account/logins/${mockIdentities.primaryPhoneIdentity.type.toLowerCase()}/${
          mockIdentities.primaryPhoneIdentity.id
        }`,
      );

      expect(
        screen.queryByRole("link", {
          name: mockIdentities.nonPrimaryPhoneIdentity.value,
        }),
      ).not.toBeInTheDocument();

      userEvent.click(
        screen.getByText(
          `Show ${sortedIdentities.phoneIdentities.length - 1} more`,
        ),
      );

      expect(
        screen.getByRole("link", {
          name: mockIdentities.primaryPhoneIdentity.value,
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", {
          name: mockIdentities.nonPrimaryPhoneIdentity.value,
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", {
          name: mockIdentities.nonPrimaryPhoneIdentity.value,
        }),
      ).toHaveAttribute(
        "href",
        `/account/logins/${mockIdentities.nonPrimaryPhoneIdentity.type.toLowerCase()}/${
          mockIdentities.nonPrimaryPhoneIdentity.id
        }`,
      );

      expect(
        screen.getByRole("link", { name: "+ add new phone number" }),
      ).toBeInTheDocument();
    });

    it("should display primary phone identity without show more button if provided 1 identity", () => {
      const sortedIdentities: SortedIdentities = {
        emailIdentities: [],
        phoneIdentities: [mockIdentities.primaryPhoneIdentity],
        socialIdentities: [],
      };

      render(<LoginsOverviewPage sortedIdentities={sortedIdentities} />);

      expect(
        screen.getByRole("link", {
          name: mockIdentities.primaryPhoneIdentity.value,
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", {
          name: mockIdentities.primaryPhoneIdentity.value,
        }),
      ).toHaveAttribute(
        "href",
        `/account/logins/${mockIdentities.primaryPhoneIdentity.type.toLowerCase()}/${
          mockIdentities.primaryPhoneIdentity.id
        }`,
      );
      expect(screen.queryByText(/Show [0-9]+ more/i)).not.toBeInTheDocument();

      expect(
        screen.getByRole("link", { name: "+ add new phone number" }),
      ).toBeInTheDocument();
    });

    it("should display default message when no identity is provided", () => {
      const sortedIdentities: SortedIdentities = {
        emailIdentities: [],
        phoneIdentities: [],
        socialIdentities: [],
      };

      render(<LoginsOverviewPage sortedIdentities={sortedIdentities} />);

      expect(
        screen.getByText("No phone number added yet."),
      ).toBeInTheDocument();
      expect(screen.queryByText(/Show [0-9]+ more/i)).not.toBeInTheDocument();

      expect(
        screen.getByRole("link", { name: "+ add new phone number" }),
      ).toBeInTheDocument();
    });
  });

  describe("Identity type: SOCIAL", () => {
    it("should display all social identities provided without the show more button", () => {
      const sortedIdentities: SortedIdentities = {
        emailIdentities: [],
        phoneIdentities: [],
        socialIdentities: [
          mockIdentities.primarySocialIdentity,
          mockIdentities.nonPrimarySocialIdentity,
        ],
      };

      render(<LoginsOverviewPage sortedIdentities={sortedIdentities} />);

      expect(screen.getByText("Github")).toBeInTheDocument();
      expect(screen.getByText("Facebook")).toBeInTheDocument();
      expect(screen.queryByText(/Show [0-9]+ more/i)).not.toBeInTheDocument();
    });

    it("should display default message when no identity is provided", () => {
      const sortedIdentities: SortedIdentities = {
        emailIdentities: [],
        phoneIdentities: [],
        socialIdentities: [],
      };

      render(<LoginsOverviewPage sortedIdentities={sortedIdentities} />);

      expect(
        screen.getByText("No social logins added yet."),
      ).toBeInTheDocument();
      expect(screen.queryByText(/Show [0-9]+ more/i)).not.toBeInTheDocument();
    });
  });

  describe("Alert message", () => {
    it("should display an alert message if there's one in the cookies", async () => {
      const sortedIdentities: SortedIdentities = {
        emailIdentities: [mockIdentities.primaryEmailIdentity],
        phoneIdentities: [],
        socialIdentities: [],
      };

      expect.assertions(3);

      render(<LoginsOverviewPage sortedIdentities={sortedIdentities} />);

      expect(
        await screen.findByText("Email address has been deleted"),
      ).toBeInTheDocument();

      expect(await screen.findByTitle("Closing cross")).toBeInTheDocument();
      userEvent.click(screen.getByTitle("Closing cross"));

      expect(
        screen.queryByText("Email address has been deleted"),
      ).not.toBeInTheDocument();
    });
  });
});
