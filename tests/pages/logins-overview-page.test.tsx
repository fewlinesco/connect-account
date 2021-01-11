import { mount } from "enzyme";
import React from "react";

import { IdentityTypes } from "@lib/@types";
import { SortedIdentities } from "@src/@types/sorted-identities";
import AlertBar from "@src/components/alert-bar/alert-bar";
import { ButtonVariant } from "@src/components/button/button";
import { ShowMoreButton } from "@src/components/display/fewlines/ShowMoreButton/ShowMoreButton";
import { FakeButton } from "@src/components/fake-button/fake-button";
import {
  BoxedLink,
  NoIdentitiesBox,
} from "@src/components/identities-section/identities-section";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { AccountApp } from "@src/pages/_app";
import LoginsOverviewPage from "@src/pages/account/logins";

jest.mock("@src/config", () => {
  return {
    config: {
      connectApplicationClientSecret: "foo-bar",
      connectAccountSessionSalt: ".*b+x3ZXE3-h[E+Q5YC5`jr~y%CA~R-[",
    },
  };
});

jest.mock("@src/dbClient", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

jest.mock("@src/utils/getFlashMessage", () => {
  return {
    getFlashMessage: jest.fn().mockImplementation(() => {
      return "Email address has been deleted";
    }),
  };
});

describe("LoginsOverviewPage", () => {
  describe("Boxedlink", () => {
    test("it should display the AlertBar since there is a flash message in the cookies", () => {
      const mockedSortedIdentities: SortedIdentities = {
        phoneIdentities: [
          {
            id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
            primary: true,
            status: "validated",
            type: IdentityTypes.PHONE,
            value: "0622116655",
          },
        ],
        emailIdentities: [
          {
            id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
            primary: true,
            status: "validated",
            type: IdentityTypes.EMAIL,
            value: "test@test.test",
          },
        ],
        socialIdentities: [
          {
            id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
            primary: true,
            status: "validated",
            type: IdentityTypes.GITHUB,
            value: "",
          },
        ],
      };
      const component = mount(
        <AccountApp>
          <LoginsOverviewPage sortedIdentities={mockedSortedIdentities} />
        </AccountApp>,
      );
      const alertBar = component.find(AlertBar);
      expect(alertBar).toHaveLength(1);
      expect(alertBar.text()).toContain("Email address has been deleted");
    });

    test("it should display email, phone and social identities if there are one of each", () => {
      const mockedSortedIdentities: SortedIdentities = {
        phoneIdentities: [
          {
            id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
            primary: true,
            status: "validated",
            type: IdentityTypes.PHONE,
            value: "0622116655",
          },
        ],
        emailIdentities: [
          {
            id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
            primary: true,
            status: "validated",
            type: IdentityTypes.EMAIL,
            value: "test@test.test",
          },
        ],
        socialIdentities: [
          {
            id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
            primary: true,
            status: "validated",
            type: IdentityTypes.GITHUB,
            value: "",
          },
        ],
      };
      const component = mount(
        <AccountApp>
          <LoginsOverviewPage sortedIdentities={mockedSortedIdentities} />
        </AccountApp>,
      );
      const boxedLink = component.find(BoxedLink);
      expect(boxedLink).toHaveLength(3);
    });

    test("it should display primary email primary phone but all social logins if there are many of each", () => {
      const mockedSortedIdentities: SortedIdentities = {
        phoneIdentities: [
          {
            id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
            primary: true,
            status: "validated",
            type: IdentityTypes.PHONE,
            value: "0622116655",
          },
          {
            id: "7y6edcc1-530b-4982-878d-33f0def6a7cf",
            primary: false,
            status: "validated",
            type: IdentityTypes.PHONE,
            value: "0622116688",
          },
        ],
        emailIdentities: [
          {
            id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
            primary: true,
            status: "validated",
            type: IdentityTypes.EMAIL,
            value: "test@test.test",
          },
          {
            id: "66tedcc1-530b-4982-878d-33f0def6a7cf",
            primary: false,
            status: "validated",
            type: IdentityTypes.EMAIL,
            value: "test2@test.test",
          },
        ],
        socialIdentities: [
          {
            id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
            primary: true,
            status: "validated",
            type: IdentityTypes.GITHUB,
            value: "",
          },
          {
            id: "8u76dcc1-530b-4982-878d-33f0def6a7cf",
            primary: false,
            status: "validated",
            type: IdentityTypes.FACEBOOK,
            value: "",
          },
        ],
      };
      const component = mount(
        <AccountApp>
          <LoginsOverviewPage sortedIdentities={mockedSortedIdentities} />
        </AccountApp>,
      );
      const boxedLink = component.find(BoxedLink);
      expect(boxedLink).toHaveLength(4);
    });

    test("it should display the no email message if there is none", () => {
      const mockedSortedIdentities: SortedIdentities = {
        phoneIdentities: [
          {
            id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
            primary: true,
            status: "validated",
            type: IdentityTypes.PHONE,
            value: "0622116655",
          },
        ],
        emailIdentities: [],
        socialIdentities: [
          {
            id: "8u76dcc1-530b-4982-878d-33f0def6a7cf",
            primary: false,
            status: "validated",
            type: IdentityTypes.FACEBOOK,
            value: "",
          },
        ],
      };
      const component = mount(
        <AccountApp>
          <LoginsOverviewPage sortedIdentities={mockedSortedIdentities} />
        </AccountApp>,
      );
      const boxedLink = component.find(BoxedLink);
      const noEmail = component.contains(
        <NoIdentitiesBox>No email added yet.</NoIdentitiesBox>,
      );
      const noPhone = component.contains(
        <NoIdentitiesBox>No phone number added yet.</NoIdentitiesBox>,
      );
      const noSocialLogins = component.contains(
        <NoIdentitiesBox>No social logins added yet.</NoIdentitiesBox>,
      );
      expect(noEmail).toEqual(true);
      expect(noPhone).toEqual(false);
      expect(noSocialLogins).toEqual(false);
      expect(boxedLink).toHaveLength(2);
    });

    test("it should display the no phone number message if there is none", () => {
      const mockedSortedIdentities: SortedIdentities = {
        phoneIdentities: [],
        emailIdentities: [
          {
            id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
            primary: true,
            status: "validated",
            type: IdentityTypes.EMAIL,
            value: "test@test.test",
          },
        ],
        socialIdentities: [
          {
            id: "8u76dcc1-530b-4982-878d-33f0def6a7cf",
            primary: false,
            status: "validated",
            type: IdentityTypes.FACEBOOK,
            value: "",
          },
        ],
      };
      const component = mount(
        <AccountApp>
          <LoginsOverviewPage sortedIdentities={mockedSortedIdentities} />
        </AccountApp>,
      );
      const boxedLink = component.find(BoxedLink);
      const noPhone = component.contains(
        <NoIdentitiesBox>No phone number added yet.</NoIdentitiesBox>,
      );
      const noEmail = component.contains(
        <NoIdentitiesBox>No email added yet.</NoIdentitiesBox>,
      );
      const noSocialLogins = component.contains(
        <NoIdentitiesBox>No social logins added yet.</NoIdentitiesBox>,
      );
      expect(noPhone).toEqual(true);
      expect(noEmail).toEqual(false);
      expect(noSocialLogins).toEqual(false);
      expect(boxedLink).toHaveLength(2);
    });

    test("it should display the no social logins message if there is none", () => {
      const mockedSortedIdentities: SortedIdentities = {
        phoneIdentities: [
          {
            id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
            primary: true,
            status: "validated",
            type: IdentityTypes.PHONE,
            value: "0622116655",
          },
        ],
        emailIdentities: [
          {
            id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
            primary: true,
            status: "validated",
            type: IdentityTypes.EMAIL,
            value: "test@test.test",
          },
        ],
        socialIdentities: [],
      };
      const component = mount(
        <AccountApp>
          <LoginsOverviewPage sortedIdentities={mockedSortedIdentities} />
        </AccountApp>,
      );
      const boxedLink = component.find(BoxedLink);
      const noSocialLogins = component.contains(
        <NoIdentitiesBox>No social logins added yet.</NoIdentitiesBox>,
      );
      const noPhone = component.contains(
        <NoIdentitiesBox>No phone number added yet.</NoIdentitiesBox>,
      );
      const noEmail = component.contains(
        <NoIdentitiesBox>No email added yet.</NoIdentitiesBox>,
      );
      expect(noSocialLogins).toEqual(true);
      expect(noPhone).toEqual(false);
      expect(noEmail).toEqual(false);
      expect(boxedLink).toHaveLength(2);
    });

    test("it should display no emails and no phones and no social logins if there are neither", () => {
      const mockedSortedIdentities: SortedIdentities = {
        phoneIdentities: [],
        emailIdentities: [],
        socialIdentities: [],
      };
      const component = mount(
        <AccountApp>
          <LoginsOverviewPage sortedIdentities={mockedSortedIdentities} />
        </AccountApp>,
      );
      const noPhone = component.contains(
        <NoIdentitiesBox>No phone number added yet.</NoIdentitiesBox>,
      );
      const noEmail = component.contains(
        <NoIdentitiesBox>No email added yet.</NoIdentitiesBox>,
      );
      const noSocialLogins = component.contains(
        <NoIdentitiesBox>No social logins added yet.</NoIdentitiesBox>,
      );
      expect(noSocialLogins).toEqual(true);
      expect(noPhone).toEqual(true);
      expect(noEmail).toEqual(true);
    });

    test("it should display navigation breadcrumbs", () => {
      const mockedSortedIdentities: SortedIdentities = {
        phoneIdentities: [],
        emailIdentities: [],
        socialIdentities: [],
      };
      const component = mount(
        <AccountApp>
          <LoginsOverviewPage sortedIdentities={mockedSortedIdentities} />
        </AccountApp>,
      );

      const h1 = component.contains(<h1>Logins</h1>);
      const h3 = component.contains(
        <h3>Your emails, phones and social logins</h3>,
      );
      expect(h1).toBe(true);
      expect(h3).toBe(true);
    });
  });

  test("it should redirect to phone page on click", () => {
    const mockedSortedIdentities: SortedIdentities = {
      phoneIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
          status: "validated",
          type: IdentityTypes.PHONE,
          value: "0622116655",
        },
      ],
      emailIdentities: [],
      socialIdentities: [],
    };
    const component = mount(
      <AccountApp>
        <LoginsOverviewPage sortedIdentities={mockedSortedIdentities} />
      </AccountApp>,
    );

    const link = component.find(NeutralLink).find("a").find({
      href: "/account/logins/phone/8f79dcc1-530b-4982-878d-33f0def6a7cf",
    });

    expect(link).toHaveLength(1);
  });

  test("it should redirect to email page on click", () => {
    const mockedSortedIdentities: SortedIdentities = {
      phoneIdentities: [],
      emailIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
          status: "validated",
          type: IdentityTypes.EMAIL,
          value: "test@test.test",
        },
      ],
      socialIdentities: [],
    };
    const component = mount(
      <AccountApp>
        <LoginsOverviewPage sortedIdentities={mockedSortedIdentities} />
      </AccountApp>,
    );

    const link = component.find(NeutralLink).find("a").find({
      href: "/account/logins/email/8f79dcc1-530b-4982-878d-33f0def6a7cf",
    });

    expect(link).toHaveLength(1);
  });

  describe("AddNewIdentityButton", () => {
    test("there must be the button for emails, phones but not social logins", () => {
      const mockedSortedIdentities: SortedIdentities = {
        phoneIdentities: [],
        emailIdentities: [],
        socialIdentities: [],
      };
      const component = mount(
        <AccountApp>
          <LoginsOverviewPage sortedIdentities={mockedSortedIdentities} />
        </AccountApp>,
      );
      const addNewIdentityButton = component
        .find(FakeButton)
        .find({ variant: ButtonVariant.SECONDARY, as: "div" });
      expect(addNewIdentityButton).toHaveLength(2);
      expect(addNewIdentityButton.at(0).text()).toEqual(
        "+ add new email address",
      );
      expect(addNewIdentityButton.at(1).text()).toEqual(
        "+ add new phone number",
      );
    });
  });
});

describe("ShowMoreButton", () => {
  test("the button's text should be relevant", () => {
    const mockedSortedIdentities: SortedIdentities = {
      phoneIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
          status: "validated",
          type: IdentityTypes.PHONE,
          value: "0622116655",
        },
        {
          id: "7y6edcc1-530b-4982-878d-33f0def6a7cf",
          primary: false,
          status: "validated",
          type: IdentityTypes.PHONE,
          value: "0622116688",
        },
        {
          id: "5r32scc1-530b-4982-878d-33f0def6a7cf",
          primary: false,
          status: "validated",
          type: IdentityTypes.PHONE,
          value: "0622116633",
        },
        {
          id: "87uytcc1-530b-4982-878d-33f0def6a7cf",
          primary: false,
          status: "validated",
          type: IdentityTypes.PHONE,
          value: "0622116611",
        },
      ],
      emailIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
          status: "validated",
          type: IdentityTypes.EMAIL,
          value: "test@test.test",
        },
        {
          id: "66tedcc1-530b-4982-878d-33f0def6a7cf",
          primary: false,
          status: "validated",
          type: IdentityTypes.EMAIL,
          value: "test2@test.test",
        },
        {
          id: "ttr43cc1-530b-4982-878d-33f0def6a7cf",
          primary: false,
          status: "validated",
          type: IdentityTypes.EMAIL,
          value: "test3@test.test",
        },
      ],
      socialIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
          status: "validated",
          type: IdentityTypes.GITHUB,
          value: "",
        },
      ],
    };
    const component = mount(
      <AccountApp>
        <LoginsOverviewPage sortedIdentities={mockedSortedIdentities} />
      </AccountApp>,
    );

    const showMoreButton1 = component.find(ShowMoreButton).at(0);
    const showMoreButton2 = component.find(ShowMoreButton).at(1);
    expect(showMoreButton1).toHaveLength(1);
    expect(showMoreButton2).toHaveLength(1);
    expect(showMoreButton1.text()).toEqual("Show 2 more ");
    expect(showMoreButton2.text()).toEqual("Show 3 more ");

    showMoreButton1.simulate("click");
    showMoreButton2.simulate("click");
    expect(showMoreButton1.text()).toEqual("Hide 2 ");
    expect(showMoreButton2.text()).toEqual("Hide 3 ");
  });

  test("the button should show/hide identities", () => {
    const mockedSortedIdentities: SortedIdentities = {
      phoneIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
          status: "validated",
          type: IdentityTypes.PHONE,
          value: "0622116655",
        },
        {
          id: "7y6edcc1-530b-4982-878d-33f0def6a7cf",
          primary: false,
          status: "validated",
          type: IdentityTypes.PHONE,
          value: "0622116688",
        },
      ],
      emailIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
          status: "validated",
          type: IdentityTypes.EMAIL,
          value: "test@test.test",
        },
        {
          id: "66tedcc1-530b-4982-878d-33f0def6a7cf",
          primary: false,
          status: "validated",
          type: IdentityTypes.EMAIL,
          value: "test2@test.test",
        },
      ],
      socialIdentities: [],
    };
    const component = mount(
      <AccountApp>
        <LoginsOverviewPage sortedIdentities={mockedSortedIdentities} />
      </AccountApp>,
    );
    const boxedLink = component.find(BoxedLink);
    const showMoreButton1 = component.find(ShowMoreButton).at(0);
    const showMoreButton2 = component.find(ShowMoreButton).at(1);
    expect(boxedLink).toHaveLength(2);

    showMoreButton1.simulate("click");
    showMoreButton2.simulate("click");
    const boxedLink2 = component.find(BoxedLink);
    expect(boxedLink2).toHaveLength(4);

    showMoreButton1.simulate("click");
    showMoreButton2.simulate("click");
    const boxedLink3 = component.find(BoxedLink);
    expect(boxedLink3).toHaveLength(2);
  });

  test("the button should not appear if the corresponding identity list < 2", () => {
    const mockedSortedIdentities: SortedIdentities = {
      phoneIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
          status: "validated",
          type: IdentityTypes.PHONE,
          value: "0622116655",
        },
      ],
      emailIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
          status: "validated",
          type: IdentityTypes.EMAIL,
          value: "test@test.test",
        },
      ],
      socialIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
          status: "validated",
          type: IdentityTypes.GITHUB,
          value: "",
        },
      ],
    };
    const component = mount(
      <AccountApp>
        <LoginsOverviewPage sortedIdentities={mockedSortedIdentities} />
      </AccountApp>,
    );
    const showMoreButton = component.find(ShowMoreButton);
    expect(showMoreButton).toHaveLength(0);
  });

  test("the button should not appear for social logins even if the list > 1 ", () => {
    const mockedSortedIdentities: SortedIdentities = {
      phoneIdentities: [],
      emailIdentities: [],
      socialIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
          status: "validated",
          type: IdentityTypes.GITHUB,
          value: "",
        },
        {
          id: "8u76dcc1-530b-4982-878d-33f0def6a7cf",
          primary: false,
          status: "validated",
          type: IdentityTypes.FACEBOOK,
          value: "",
        },
      ],
    };
    const component = mount(
      <AccountApp>
        <LoginsOverviewPage sortedIdentities={mockedSortedIdentities} />
      </AccountApp>,
    );
    const showMoreButton = component.find(ShowMoreButton);
    expect(showMoreButton).toHaveLength(0);
  });
});
