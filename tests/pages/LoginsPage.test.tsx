import { mount } from "enzyme";
import Link from "next/link";
import React from "react";

import { IdentityTypes } from "@lib/@types";
import { SortedIdentities } from "@src/@types/SortedIdentities";
import { BoxedLink } from "@src/components/display/fewlines/BoxedLink/BoxedLink";
import { Value } from "@src/components/display/fewlines/Logins/Logins";
import { SmallHeader } from "@src/components/display/fewlines/Logins/Logins";
import { ShowMoreButton } from "@src/components/display/fewlines/ShowMoreButton/ShowMoreButton";
import { AccountApp } from "@src/pages/_app";
import LoginsPage from "@src/pages/account/logins/index";

jest.mock("@src/config", () => {
  return {
    config: {
      connectApplicationClientSecret: "foo-bar",
      connectAccountSessionSalt: ".*b+x3ZXE3-h[E+Q5YC5`jr~y%CA~R-[",
    },
  };
});

describe("LoginsPage", () => {
  describe("Boxedlink", () => {
    test("it should display email and phone when there are one of each", () => {
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
      };
      const component = mount(
        <AccountApp>
          <LoginsPage sortedIdentities={mockedSortedResponse} />
        </AccountApp>,
      );
      const boxedLink = component.find(BoxedLink);
      expect(boxedLink).toHaveLength(2);
    });

    test("it should display primary email and primary phone when there are many of each", () => {
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
      };
      const component = mount(
        <AccountApp>
          <LoginsPage sortedIdentities={mockedSortedResponse} />
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
      };
      const component = mount(
        <AccountApp>
          <LoginsPage sortedIdentities={mockedSortedResponse} />
        </AccountApp>,
      );
      const boxedLink = component.find(BoxedLink);
      const noEmail = component.contains(<Value>No emails</Value>);
      expect(noEmail).toEqual(true);
      expect(boxedLink).toHaveLength(1);
    });

    test("it should display no phones when there are not", () => {
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
      };
      const component = mount(
        <AccountApp>
          <LoginsPage sortedIdentities={mockedSortedResponse} />
        </AccountApp>,
      );
      const boxedLink = component.find(BoxedLink);
      const noPhone = component.contains(<Value>No phones</Value>);

      expect(noPhone).toEqual(true);
      expect(boxedLink).toHaveLength(1);
    });

    test("it should display no emails and no phones where there are neither", () => {
      const mockedSortedResponse: SortedIdentities = {
        phoneIdentities: [],
        emailIdentities: [],
      };
      const component = mount(
        <AccountApp>
          <LoginsPage sortedIdentities={mockedSortedResponse} />
        </AccountApp>,
      );
      const noPhone = component.contains(<Value>No phones</Value>);
      const noEmail = component.contains(<Value>No emails</Value>);
      expect(noPhone).toEqual(true);
      expect(noEmail).toEqual(true);
    });

    test("it should display navigation breadcrumbs", () => {
      const mockedSortedResponse: SortedIdentities = {
        phoneIdentities: [],
        emailIdentities: [],
      };
      const component = mount(
        <AccountApp>
          <LoginsPage sortedIdentities={mockedSortedResponse} />
        </AccountApp>,
      );

      const smallHeader = component.find(SmallHeader);
      expect(smallHeader).toHaveLength(1);
      expect(smallHeader.contains(<h1>Logins</h1>)).toEqual(true);
      expect(
        smallHeader.contains(<p>Your emails, phones and social logins</p>),
      ).toEqual(true);
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
      };
      const component = mount(
        <AccountApp>
          <LoginsPage sortedIdentities={mockedSortedResponse} />
        </AccountApp>,
      );

      const link = component.find(Link).find({
        as: "/account/logins/phone/8f79dcc1-530b-4982-878d-33f0def6a7cf",
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
      };
      const component = mount(
        <AccountApp>
          <LoginsPage sortedIdentities={mockedSortedResponse} />
        </AccountApp>,
      );

      const link = component.find(Link).find({
        as: "/account/logins/email/8f79dcc1-530b-4982-878d-33f0def6a7cf",
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
      };
      const component = mount(
        <AccountApp>
          <LoginsPage sortedIdentities={mockedSortedResponse} />
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
      };
      const component = mount(
        <AccountApp>
          <LoginsPage sortedIdentities={mockedSortedResponse} />
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
      };
      const component = mount(
        <AccountApp>
          <LoginsPage sortedIdentities={mockedSortedResponse} />
        </AccountApp>,
      );
      const showMoreButton = component.find(ShowMoreButton);
      expect(showMoreButton).toHaveLength(0);
    });
  });
});
