import userEvent from "@testing-library/user-event";
import React from "react";
import { cache, SWRConfig } from "swr";

import { render, screen } from "../config/testing-library-config";
import * as mockIdentities from "../mocks/identities";
import { SortedIdentities } from "@src/@types/sorted-identities";
import LoginsOverviewPage from "@src/pages/account/logins";

jest.mock("@src/configs/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

describe("LoginsOverviewPage", () => {
  afterEach(() => {
    cache.clear();
  });

  describe("Identity type: EMAIL", () => {
    afterEach(() => {
      cache.clear();
    });

    it("should display primary email identity first and all of them when clicking on the show more button", async () => {
      expect.assertions(7);

      const sortedIdentities: SortedIdentities = {
        emailIdentities: [
          mockIdentities.primaryEmailIdentity,
          mockIdentities.nonPrimaryEmailIdentity,
        ],
        phoneIdentities: [],
        socialIdentities: [],
      };

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { sortedIdentities };
            },
          }}
        >
          <LoginsOverviewPage />
        </SWRConfig>,
      );

      expect(
        await screen.findByRole("link", {
          name: new RegExp(`${mockIdentities.primaryEmailIdentity.value}`, "i"),
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
        screen.getByRole("link", { name: "+ Add new email address" }),
      ).toBeInTheDocument();
    });

    it("should display primary email identity without show more button if provided 1 identity", async () => {
      expect.assertions(4);

      const sortedIdentities: SortedIdentities = {
        emailIdentities: [mockIdentities.primaryEmailIdentity],
        phoneIdentities: [],
        socialIdentities: [],
      };

      cache.set("/api/identity/get-sorted-identities", { sortedIdentities });

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { sortedIdentities };
            },
          }}
        >
          <LoginsOverviewPage />
        </SWRConfig>,
      );

      expect(
        await screen.findByRole("link", {
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
        screen.getByRole("link", { name: "+ Add new email address" }),
      ).toBeInTheDocument();
    });

    it("should display default message when no identity is provided", async () => {
      expect.assertions(3);

      const sortedIdentities: SortedIdentities = {
        emailIdentities: [],
        phoneIdentities: [],
        socialIdentities: [],
      };

      cache.set("/api/identity/get-sorted-identities", { sortedIdentities });

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { sortedIdentities };
            },
          }}
        >
          <LoginsOverviewPage />
        </SWRConfig>,
      );

      expect(
        await screen.findByText(new RegExp("No email added yet.", "i")),
      ).toBeInTheDocument();
      expect(screen.queryByText(/Show [0-9]+ more/i)).not.toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "+ Add new email address" }),
      ).toBeInTheDocument();
    });
  });

  describe("Identity type: PHONE", () => {
    afterEach(() => {
      cache.clear();
    });

    it("should display primary phone identity first and all of them when clicking on the show more button", async () => {
      expect.assertions(7);

      const sortedIdentities: SortedIdentities = {
        emailIdentities: [],
        phoneIdentities: [
          mockIdentities.primaryPhoneIdentity,
          mockIdentities.nonPrimaryPhoneIdentity,
        ],
        socialIdentities: [],
      };

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { sortedIdentities };
            },
          }}
        >
          <LoginsOverviewPage />
        </SWRConfig>,
      );

      expect(
        await screen.findByRole("link", {
          name: new RegExp(`${mockIdentities.primaryPhoneIdentity.value}`, "i"),
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
        screen.getByRole("link", { name: "+ Add new phone number" }),
      ).toBeInTheDocument();
    });

    it("should display primary phone identity without show more button if provided 1 identity", async () => {
      expect.assertions(4);

      const sortedIdentities: SortedIdentities = {
        emailIdentities: [],
        phoneIdentities: [mockIdentities.primaryPhoneIdentity],
        socialIdentities: [],
      };

      cache.set("/api/identity/get-sorted-identities", { sortedIdentities });

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { sortedIdentities };
            },
          }}
        >
          <LoginsOverviewPage />
        </SWRConfig>,
      );

      expect(
        await screen.findByRole("link", {
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
        screen.getByRole("link", { name: "+ Add new phone number" }),
      ).toBeInTheDocument();
    });

    it("should display default message when no identity is provided", async () => {
      expect.assertions(3);

      const sortedIdentities: SortedIdentities = {
        emailIdentities: [],
        phoneIdentities: [],
        socialIdentities: [],
      };

      cache.set("/api/identity/get-sorted-identities", { sortedIdentities });

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { sortedIdentities };
            },
          }}
        >
          <LoginsOverviewPage />
        </SWRConfig>,
      );

      expect(
        await screen.findByText(new RegExp("No phone number added yet.", "i")),
      ).toBeInTheDocument();
      expect(screen.queryByText(/Show [0-9]+ more/i)).not.toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "+ Add new phone number" }),
      ).toBeInTheDocument();
    });
  });

  describe("Identity type: SOCIAL", () => {
    afterEach(() => {
      cache.clear();
    });

    it("should display all social identities provided without the show more button", async () => {
      expect.assertions(3);

      const sortedIdentities: SortedIdentities = {
        emailIdentities: [],
        phoneIdentities: [],
        socialIdentities: [
          mockIdentities.primarySocialIdentity,
          mockIdentities.nonPrimarySocialIdentity,
        ],
      };

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { sortedIdentities };
            },
          }}
        >
          <LoginsOverviewPage />
        </SWRConfig>,
      );

      const gitHub = await screen.findAllByText(new RegExp("Github", "i"));
      expect(gitHub[1].innerHTML).toBe("Github");
      const facebook = await screen.findAllByText(new RegExp("Facebook", "i"));
      expect(facebook[1].innerHTML).toBe("Facebook");
      expect(screen.queryByText(/Show [0-9]+ more/i)).not.toBeInTheDocument();
    });

    it("should display default message when no identity is provided", async () => {
      expect.assertions(2);

      const sortedIdentities: SortedIdentities = {
        emailIdentities: [],
        phoneIdentities: [],
        socialIdentities: [],
      };

      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            fetcher: () => {
              return { sortedIdentities };
            },
          }}
        >
          <LoginsOverviewPage />
        </SWRConfig>,
      );

      expect(
        await screen.findByText(new RegExp("No social logins added yet.", "i")),
      ).toBeInTheDocument();
      expect(screen.queryByText(/Show [0-9]+ more/i)).not.toBeInTheDocument();
    });
  });
});
