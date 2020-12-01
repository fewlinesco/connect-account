import { mount } from "enzyme";
import Link from "next/link";
import React from "react";

import { IdentityTypes } from "@lib/@types";
import { SortedIdentities } from "@src/@types/SortedIdentities";
import { H1 } from "@src/components/display/fewlines/H1/H1";
import { H2 } from "@src/components/display/fewlines/H2/H2";
import { NoIdentitiesBox } from "@src/components/display/fewlines/LoginsOverview/LoginsOverview";
import { BoxedLink } from "@src/components/display/fewlines/LoginsOverview/LoginsOverview";
import { NeutralLink } from "@src/components/display/fewlines/NeutralLink";
import { ShowMoreButton } from "@src/components/display/fewlines/ShowMoreButton/ShowMoreButton";
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

describe("LoginsOverviewPage", () => {
  describe("Boxedlink", () => {
    test("it should display email, phone and social identities when there are one of each", () => {
      const mockedSortedResponse: SortedIdentities = {
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
          <LoginsOverviewPage sortedIdentities={mockedSortedResponse} />
        </AccountApp>,
      );
      const boxedLink = component.find(BoxedLink);
      expect(boxedLink).toHaveLength(3);
    });

    test("it should display primary email primary phone when there are many of each", () => {
      const mockedSortedResponse: SortedIdentities = {
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
          <LoginsOverviewPage sortedIdentities={mockedSortedResponse} />
        </AccountApp>,
      );
      const boxedLink = component.find(BoxedLink);
      expect(boxedLink).toHaveLength(2);
    });

    test("it should display no emails when there are not", () => {
      const mockedSortedResponse: SortedIdentities = {
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
          <LoginsOverviewPage sortedIdentities={mockedSortedResponse} />
        </AccountApp>,
      );
      const boxedLink = component.find(BoxedLink);
      const noEmail = component.contains(
        <NoIdentitiesBox>No emails added yet.</NoIdentitiesBox>,
      );
      expect(noEmail).toEqual(true);
      expect(boxedLink).toHaveLength(1);
    });

    test("it should display No phone number added yet. when there are not", () => {
      const mockedSortedResponse: SortedIdentities = {
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
          <LoginsOverviewPage sortedIdentities={mockedSortedResponse} />
        </AccountApp>,
      );
      const boxedLink = component.find(BoxedLink);
      const noPhone = component.contains(
        <NoIdentitiesBox>No phone number added yet.</NoIdentitiesBox>,
      );

      expect(noPhone).toEqual(true);
      expect(boxedLink).toHaveLength(1);
    });

    test("it should display no emails and no phones where there are neither", () => {
      const mockedSortedResponse: SortedIdentities = {
        phoneIdentities: [],
        emailIdentities: [],
        socialIdentities: [],
      };
      const component = mount(
        <AccountApp>
          <LoginsOverviewPage sortedIdentities={mockedSortedResponse} />
        </AccountApp>,
      );
      const noPhone = component.contains(
        <NoIdentitiesBox>No phone number added yet.</NoIdentitiesBox>,
      );
      const noEmail = component.contains(
        <NoIdentitiesBox>No emails added yet.</NoIdentitiesBox>,
      );
      expect(noPhone).toEqual(true);
      expect(noEmail).toEqual(true);
    });

    test("it should display navigation breadcrumbs", () => {
      const mockedSortedResponse: SortedIdentities = {
        phoneIdentities: [],
        emailIdentities: [],
        socialIdentities: [],
      };
      const component = mount(
        <AccountApp>
          <LoginsOverviewPage sortedIdentities={mockedSortedResponse} />
        </AccountApp>,
      );

      const h1 = component.find(H1);
      const h2 = component.find(H2);
      expect(h1).toHaveLength(1);
      expect(h1.text()).toEqual("Logins");
      expect(h2).toHaveLength(1);
      expect(h2.text()).toEqual("Your emails, phones and social logins");
    });
  });

  test("it should redirect to phone page on click", () => {
    const mockedSortedResponse: SortedIdentities = {
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
        <LoginsOverviewPage sortedIdentities={mockedSortedResponse} />
      </AccountApp>,
    );

    const link = component.find(NeutralLink).find("a").find({
      href: "/account/logins/phone/8f79dcc1-530b-4982-878d-33f0def6a7cf",
    });

    expect(link).toHaveLength(1);
  });

  test("it should redirect to email page on click", () => {
    const mockedSortedResponse: SortedIdentities = {
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
        <LoginsOverviewPage sortedIdentities={mockedSortedResponse} />
      </AccountApp>,
    );

    const link = component.find(NeutralLink).find("a").find({
      href: "/account/logins/email/8f79dcc1-530b-4982-878d-33f0def6a7cf",
    });

    expect(link).toHaveLength(1);
  });
});

describe("ShowMoreButton", () => {
  test("the button's text should be relevant", () => {
    const mockedSortedResponse: SortedIdentities = {
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
        <LoginsOverviewPage sortedIdentities={mockedSortedResponse} />
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
    const mockedSortedResponse: SortedIdentities = {
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
        <LoginsOverviewPage sortedIdentities={mockedSortedResponse} />
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
    const mockedSortedResponse: SortedIdentities = {
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
        <LoginsOverviewPage sortedIdentities={mockedSortedResponse} />
      </AccountApp>,
    );
    const showMoreButton = component.find(ShowMoreButton);
    expect(showMoreButton).toHaveLength(0);
  });
});
