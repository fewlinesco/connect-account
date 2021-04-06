import { Identity } from "@fewlines/connect-management";
import userEvent from "@testing-library/user-event";
import React from "react";
import { cache, SWRConfig } from "swr";

import { render, screen } from "../config/testing-library-config";
import * as mockIdentities from "../mocks/identities";
import { findByTextContent } from "../utils/find-by-text-content";
import IdentityOverviewPage from "@src/pages/account/logins/[type]/[id]";

jest.mock("@src/configs/db-client", () => {
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

function makeAsPrimaryStringFactory(identity: Identity): string {
  return (
    "Make " + identity.value + " my primary " + identity.type.toLowerCase()
  );
}

describe("IdentityOverviewPage", () => {
  afterEach(() => {
    cache.clear();
  });

  describe("Identity type: EMAIL", () => {
    afterEach(() => {
      cache.clear();
    });

    it("should render proper email breadcrumbs", async () => {
      expect.assertions(1);

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { identity: mockIdentities.nonPrimaryEmailIdentity };
            },
          }}
        >
          <IdentityOverviewPage
            identityId={mockIdentities.nonPrimaryEmailIdentity.id}
          />
          ,
        </SWRConfig>,
      );

      expect(await screen.findByText("Email address")).toBeInTheDocument();
    });

    it("should display the relevant delete & mark as primary buttons but not validate identity one for a non primary validated email address", async () => {
      expect.assertions(3);

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { identity: mockIdentities.nonPrimaryEmailIdentity };
            },
          }}
        >
          <IdentityOverviewPage
            identityId={mockIdentities.nonPrimaryEmailIdentity.id}
          />
        </SWRConfig>,
      );

      expect(
        await screen.findByRole("button", {
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
      expect.assertions(2);

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { identity: mockIdentities.nonPrimaryEmailIdentity };
            },
          }}
        >
          <IdentityOverviewPage
            identityId={mockIdentities.nonPrimaryEmailIdentity.id}
          />
        </SWRConfig>,
      );

      expect(screen.queryByText("Primary")).not.toBeInTheDocument();
      expect(screen.queryByText("Awaiting validation")).not.toBeInTheDocument();
    });

    it("shouldn't display the delete, mark as primary & validate identity buttons for a primary email address", () => {
      expect.assertions(3);

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { identity: mockIdentities.primaryEmailIdentity };
            },
          }}
        >
          <IdentityOverviewPage
            identityId={mockIdentities.primaryEmailIdentity.id}
          />
        </SWRConfig>,
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

    it("should display primary badge and not the awaiting validation one for a primary email", async () => {
      expect.assertions(2);

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { identity: mockIdentities.primaryEmailIdentity };
            },
          }}
        >
          <IdentityOverviewPage
            identityId={mockIdentities.primaryEmailIdentity.id}
          />
        </SWRConfig>,
      );

      expect(
        await findByTextContent(mockIdentities.primaryEmailIdentity.value),
      ).toBeTruthy();
      expect(screen.queryByText("Awaiting validation")).not.toBeInTheDocument();
    });

    it("should display the delete & validate identity buttons but not mark as primary one for an unvalidated email address", async () => {
      expect.assertions(3);

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { identity: mockIdentities.unvalidatedEmailIdentity };
            },
          }}
        >
          <IdentityOverviewPage
            identityId={mockIdentities.unvalidatedEmailIdentity.id}
          />
        </SWRConfig>,
      );

      expect(
        await screen.findByRole("button", {
          name: makeAsPrimaryRegExFactory(
            mockIdentities.unvalidatedEmailIdentity,
          ),
        }),
      ).not.toBeInTheDocument();
      expect(
        await screen.findByRole("link", { name: "Proceed to validation" }),
      ).toHaveAttribute("href", "/account/logins/EMAIL/validation");
      expect(
        await screen.findByRole("button", {
          name: /Delete this email address/i,
        }),
      ).toBeInTheDocument();
    });

    it("should display the awaiting validation badge and not primary one for an unvalidated email", async () => {
      expect.assertions(2);

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { identity: mockIdentities.unvalidatedEmailIdentity };
            },
          }}
        >
          <IdentityOverviewPage
            identityId={mockIdentities.unvalidatedEmailIdentity.id}
          />
        </SWRConfig>,
      );

      expect(
        await screen.findByText("Awaiting validation"),
      ).toBeInTheDocument();
      expect(screen.queryByText("Primary")).not.toBeInTheDocument();
    });
  });

  describe.only("Identity type: PHONE", () => {
    afterEach(() => {
      cache.clear();
    });

    it("should render proper phone identity breadcrumbs", async () => {
      expect.assertions(1);

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { identity: mockIdentities.nonPrimaryPhoneIdentity };
            },
          }}
        >
          <IdentityOverviewPage
            identityId={mockIdentities.nonPrimaryPhoneIdentity.id}
          />
        </SWRConfig>,
      );

      expect(await screen.findByText("Phone number")).toBeInTheDocument();
    });

    it("should display the relevant delete & mark as primary buttons but not validate identity one for a non primary validated phone number", async () => {
      expect.assertions(2);

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { identity: mockIdentities.nonPrimaryPhoneIdentity };
            },
          }}
        >
          <IdentityOverviewPage
            identityId={mockIdentities.nonPrimaryPhoneIdentity.id}
          />
        </SWRConfig>,
      );

      expect(
        await screen.findByRole("button", {
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

    it("shouldn't display primary badge nor the awaiting validation one for a non primary validated phone number", async () => {
      // expect.assertions(1);

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { identity: mockIdentities.nonPrimaryPhoneIdentity };
            },
          }}
        >
          <IdentityOverviewPage
            identityId={mockIdentities.nonPrimaryPhoneIdentity.id}
          />
        </SWRConfig>,
      );

      expect(await findByTextContent("Primary")).toBeTruthy();
      expect(screen.queryByText("Awaiting validation")).not.toBeInTheDocument();
    });

    it("shouldn't display the delete, mark as primary & validate identity buttons for a primary phone number", async () => {
      // expect.assertions(1);

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { identity: mockIdentities.primaryPhoneIdentity };
            },
          }}
        >
          <IdentityOverviewPage
            identityId={mockIdentities.primaryPhoneIdentity.id}
          />
        </SWRConfig>,
      );

      expect(
        await findByTextContent(
          makeAsPrimaryStringFactory(mockIdentities.primaryPhoneIdentity),
        ),
      ).toBeFalsy();
      expect(await findByTextContent("Delete this phone number")).toBeFalsy();
      expect(await findByTextContent("Proceed to validation")).toBeFalsy();
    });

    it("should display primary badge and not the awaiting validation one for a primary phone number", async () => {
      expect.assertions(2);

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { identity: mockIdentities.primaryPhoneIdentity };
            },
          }}
        >
          <IdentityOverviewPage
            identityId={mockIdentities.primaryPhoneIdentity.id}
          />
        </SWRConfig>,
      );

      expect(await findByTextContent("Primary")).toBeTruthy();
      expect(screen.queryByText("Awaiting validation")).not.toBeInTheDocument();
    });

    it("should display the delete & validate identity buttons but not mark as primary one for an unvalidated phone number", async () => {
      expect.assertions(3);

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { identity: mockIdentities.unvalidatedPhoneIdentity };
            },
          }}
        >
          <IdentityOverviewPage
            identityId={mockIdentities.unvalidatedPhoneIdentity.id}
          />
        </SWRConfig>,
      );

      expect(
        await screen.findByRole("link", { name: "Proceed to validation" }),
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

    it("should display the awaiting validation badge and not primary one for an unvalidated phone number", async () => {
      expect.assertions(2);

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { identity: mockIdentities.unvalidatedPhoneIdentity };
            },
          }}
        >
          <IdentityOverviewPage
            identityId={mockIdentities.unvalidatedPhoneIdentity.id}
          />
        </SWRConfig>,
      );

      expect(
        await screen.findByText("Awaiting validation"),
      ).toBeInTheDocument();
      expect(screen.queryByText("Primary")).not.toBeInTheDocument();
    });
  });
});
