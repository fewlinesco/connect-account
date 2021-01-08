import userEvent from "@testing-library/user-event";
import React from "react";

import { render, screen, waitFor } from "../config/testing-library-config";
import { IdentityTypes, Identity } from "@lib/@types";
import IdentityOverviewPage from "@src/pages/account/logins/[type]/[id]";

jest.mock("@src/dbClient", () => {
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

const nonPrimaryEmailIdentity: Identity = {
  id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
  primary: false,
  status: "validated",
  type: IdentityTypes.EMAIL,
  value: "Test@test.test",
};

const primaryEmailIdentity: Identity = {
  id: "6tf443c1-530b-4982-878d-33f0def6a7cf",
  primary: true,
  status: "validated",
  type: IdentityTypes.EMAIL,
  value: "test4@test.test",
};

const unvalidatedEmailIdentity: Identity = {
  id: "77yt43c1-530b-4982-878d-33f0def6a7cf",
  primary: false,
  status: "unvalidated",
  type: IdentityTypes.EMAIL,
  value: "test6@test.test",
};

const nonPrimaryPhoneIdentity: Identity = {
  id: "81z343c1-530b-4982-878d-33f0def6a7cf",
  primary: false,
  status: "validated",
  type: IdentityTypes.PHONE,
  value: "0642424242",
};

const primaryPhoneIdentity: Identity = {
  id: "81z343c1-530b-4982-878d-33f0def6a7cf",
  primary: true,
  status: "validated",
  type: IdentityTypes.PHONE,
  value: "0642424242",
};

const unvalidatedPhoneIdentity: Identity = {
  id: "81z343c1-530b-4982-878d-33f0def6a7cf",
  primary: false,
  status: "unvalidated",
  type: IdentityTypes.PHONE,
  value: "0642424242",
};

describe("IdentityOverviewPage", () => {
  describe("Identity type: EMAIL", () => {
    it("should render proper email breadcrumbs", () => {
      render(
        <IdentityOverviewPage
          identity={nonPrimaryEmailIdentity}
          userId={userId}
        />,
      );

      expect(screen.getByText("Email address")).toBeInTheDocument();
    });

    it("should display the relevant options delete & mark as primary buttons but not validate identity one for a non primary validated email adress", () => {
      render(
        <IdentityOverviewPage
          identity={nonPrimaryEmailIdentity}
          userId={userId}
        />,
      );

      expect(
        screen.getByRole("button", {
          name: makeAsPrimaryRegExFactory(nonPrimaryEmailIdentity),
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
          identity={nonPrimaryEmailIdentity}
          userId={userId}
        />,
      );

      expect(screen.queryByText("Primary")).not.toBeInTheDocument();
      expect(screen.queryByText("Awaiting validation")).not.toBeInTheDocument();
    });

    it("shouldn't display the option delete, mark as primary & validate identity buttons for a primary email address", () => {
      render(
        <IdentityOverviewPage
          identity={primaryEmailIdentity}
          userId={userId}
        />,
      );

      expect(
        screen.queryByRole("button", {
          name: makeAsPrimaryRegExFactory(primaryEmailIdentity),
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
          identity={primaryEmailIdentity}
          userId={userId}
        />,
      );

      expect(screen.getByText("Primary")).toBeInTheDocument();
      expect(screen.queryByText("Awaiting validation")).not.toBeInTheDocument();
    });

    it("should display the option delete & validate identity buttons but not mark as primary one for an unvalidated email address", () => {
      render(
        <IdentityOverviewPage
          identity={unvalidatedEmailIdentity}
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
          name: makeAsPrimaryRegExFactory(unvalidatedEmailIdentity),
        }),
      ).not.toBeInTheDocument();
    });

    it("should display the awaiting validation badge and not primary one for an unvalidated email", () => {
      render(
        <IdentityOverviewPage
          identity={unvalidatedEmailIdentity}
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
          identity={nonPrimaryPhoneIdentity}
          userId={userId}
        />,
      );

      expect(screen.getByText("Phone number")).toBeInTheDocument();
    });

    it("should display the relevant options delete & mark as primary buttons but not validate identity one for a non primary validated phone number", () => {
      render(
        <IdentityOverviewPage
          identity={nonPrimaryPhoneIdentity}
          userId={userId}
        />,
      );

      expect(
        screen.getByRole("button", {
          name: makeAsPrimaryRegExFactory(nonPrimaryPhoneIdentity),
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
          identity={nonPrimaryPhoneIdentity}
          userId={userId}
        />,
      );

      expect(screen.queryByText("Primary")).not.toBeInTheDocument();
      expect(screen.queryByText("Awaiting validation")).not.toBeInTheDocument();
    });

    it("shouldn't display the option delete, mark as primary & validate identity buttons for a primary phone number", () => {
      render(
        <IdentityOverviewPage
          identity={primaryPhoneIdentity}
          userId={userId}
        />,
      );

      expect(
        screen.queryByRole("button", {
          name: makeAsPrimaryRegExFactory(primaryPhoneIdentity),
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
          identity={primaryPhoneIdentity}
          userId={userId}
        />,
      );

      expect(screen.getByText("Primary")).toBeInTheDocument();
      expect(screen.queryByText("Awaiting validation")).not.toBeInTheDocument();
    });

    it("should display the option delete & validate identity buttons but not mark as primary one for an unvalidated phone number", () => {
      render(
        <IdentityOverviewPage
          identity={unvalidatedPhoneIdentity}
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
          name: makeAsPrimaryRegExFactory(unvalidatedPhoneIdentity),
        }),
      ).not.toBeInTheDocument();
    });

    it("should display the awaiting validation badge and not primary one for an unvalidated phone number", () => {
      render(
        <IdentityOverviewPage
          identity={unvalidatedPhoneIdentity}
          userId={userId}
        />,
      );

      expect(screen.getByText("Awaiting validation")).toBeInTheDocument();
      expect(screen.queryByText("Primary")).not.toBeInTheDocument();
    });
  });
});

describe("ConfirmationBox", () => {
  it("shouldn't display any confirmation box on first render", () => {
    render(
      <IdentityOverviewPage
        identity={nonPrimaryEmailIdentity}
        userId={userId}
      />,
    );

    expect(
      screen.queryByText(
        `You are about to set ${nonPrimaryEmailIdentity.value} as primary.`,
      ),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        `You are about to delete ${nonPrimaryEmailIdentity.value}`,
      ),
    ).not.toBeInTheDocument();
  });

  it("should display primary confirmation box after cliking on mark as primary button & close it by clicking on cancel button", async () => {
    render(
      <IdentityOverviewPage
        identity={nonPrimaryEmailIdentity}
        userId={userId}
      />,
    );

    expect.assertions(3);

    userEvent.click(
      screen.getByRole("button", {
        name: makeAsPrimaryRegExFactory(nonPrimaryEmailIdentity),
      }),
    );

    expect(
      screen.queryByText(
        `You are about to set ${nonPrimaryEmailIdentity.value} as primary.`,
      ),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("button", {
        name: "Cancel",
      }),
    ).toBeInTheDocument();

    userEvent.click(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    );

    waitFor(() => {
      expect(
        screen.queryByText(
          `You are about to set ${nonPrimaryEmailIdentity.value} as primary.`,
        ),
      ).not.toBeVisible();
    });
  });

  it("should display delete confirmation box after cliking on delete button & close it by clicking on cancel button", async () => {
    render(
      <IdentityOverviewPage
        identity={nonPrimaryEmailIdentity}
        userId={userId}
      />,
    );

    expect.assertions(3);

    userEvent.click(
      screen.getByRole("button", {
        name: /Delete this email address/i,
      }),
    );

    expect(
      screen.queryByText(
        `You are about to delete ${nonPrimaryEmailIdentity.value}`,
      ),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("button", {
        name: "Keep email address",
      }),
    ).toBeInTheDocument();

    userEvent.click(
      screen.getByRole("button", {
        name: "Keep email address",
      }),
    );

    waitFor(() => {
      expect(
        screen.queryByText(
          `You are about to delete ${nonPrimaryEmailIdentity.value}`,
        ),
      ).not.toBeVisible();
    });
  });

  it("should close confirmation box when clicking outside of it", () => {
    render(
      <IdentityOverviewPage
        identity={nonPrimaryEmailIdentity}
        userId={userId}
      />,
    );

    userEvent.click(
      screen.getByRole("button", {
        name: /Delete this email address/i,
      }),
    );

    expect(
      screen.queryByText(
        `You are about to delete ${nonPrimaryEmailIdentity.value}`,
      ),
    ).toBeInTheDocument();

    userEvent.click(screen.getByTestId("clickAwayListener"));

    waitFor(() => {
      expect(
        screen.queryByText(
          `You are about to delete ${nonPrimaryEmailIdentity.value}`,
        ),
      ).not.toBeVisible();
    });
  });
});
