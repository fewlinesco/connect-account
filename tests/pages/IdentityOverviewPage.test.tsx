jest.mock("@src/hooks/useCookies");

import { mount } from "enzyme";
import fetch from "jest-fetch-mock";
import { enableFetchMocks } from "jest-fetch-mock";
import React from "react";

import { IdentityTypes, Identity } from "@lib/@types";
import { AwaitingValidationBadge } from "@src/components/display/fewlines/AwaitingValidationBadge/AwaitingValidationBadge";
import {
  Button,
  ButtonVariant,
} from "@src/components/display/fewlines/Button/Button";
import { ClickAwayListener } from "@src/components/display/fewlines/ClickAwayListener";
import { ConfirmationBox } from "@src/components/display/fewlines/ConfirmationBox/ConfirmationBox";
import { DeleteConfirmationText } from "@src/components/display/fewlines/ConfirmationBox/DeleteConfirmationBox";
import { PrimaryConfirmationText } from "@src/components/display/fewlines/ConfirmationBox/PrimaryConfirmationBox";
import {
  NavigationBreadcrumbs,
  Breadcrumbs,
} from "@src/components/display/fewlines/NavigationBreadcrumbs/NavigationBreadcrumbs";
import { PrimaryBadge } from "@src/components/display/fewlines/PrimaryBadge/PrimaryBadge";
import { useCookies } from "@src/hooks/useCookies";
import { AccountApp } from "@src/pages/_app";
import IdentityOverviewPage from "@src/pages/account/logins/[type]/[id]";
import * as fetchJson from "@src/utils/fetchJson";

enableFetchMocks();

jest.mock("@src/config", () => {
  return {
    config: {
      connectApplicationClientSecret: "foo-bar",
      connectAccountSessionSalt: ".*b+x3ZXE3-h[E+Q5YC5`jr~y%CA~R-[",
    },
  };
});

(useCookies as any).mockImplementation(() => {
  return {
    data: {
      userDocumentId: "ac3f358d-d2c9-487e-8387-2e6866b853c9",
    },
  };
});

describe("IdentityOverviewPage", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  const nonPrimaryIdentity: Identity = {
    id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
    primary: false,
    status: "validated",
    type: IdentityTypes.EMAIL,
    value: "test@test.test",
  };

  const primaryIdentity: Identity = {
    id: "6tf443c1-530b-4982-878d-33f0def6a7cf",
    primary: true,
    status: "validated",
    type: IdentityTypes.EMAIL,
    value: "test4@test.test",
  };

  const nonValidatedIdentity: Identity = {
    id: "77yt43c1-530b-4982-878d-33f0def6a7cf",
    primary: false,
    status: "unvalidated",
    type: IdentityTypes.EMAIL,
    value: "test6@test.test",
  };

  const phoneIdentity: Identity = {
    id: "81z343c1-530b-4982-878d-33f0def6a7cf",
    primary: false,
    status: "unvalidated",
    type: IdentityTypes.PHONE,
    value: "0722443311",
  };

  test("it should display navigation breadcrumbs properly for emails", () => {
    const component = mount(
      <AccountApp>
        <IdentityOverviewPage identity={nonPrimaryIdentity} />
      </AccountApp>,
    );

    const navigationBreadCrumbs = component.find(NavigationBreadcrumbs);
    expect(navigationBreadCrumbs).toHaveLength(1);

    expect(
      navigationBreadCrumbs.contains(<Breadcrumbs>Email address</Breadcrumbs>),
    ).toEqual(true);
  });

  test("it should display navigation breadcrumbs properly for phones", () => {
    const component = mount(
      <AccountApp>
        <IdentityOverviewPage identity={phoneIdentity} />
      </AccountApp>,
    );

    const navigationBreadCrumbs = component.find(NavigationBreadcrumbs);
    expect(navigationBreadCrumbs).toHaveLength(1);
    expect(
      navigationBreadCrumbs.contains(<Breadcrumbs>Phone number</Breadcrumbs>),
    ).toEqual(true);
  });

  test("it should display the update button for a non primary identity", () => {
    const component = mount(
      <AccountApp>
        <IdentityOverviewPage identity={nonPrimaryIdentity} />
      </AccountApp>,
    );

    const updateButton = component.contains(
      <Button variant={ButtonVariant.PRIMARY}>
        Update this email address
      </Button>,
    );
    expect(updateButton).toEqual(true);
  });

  test("it should display the update button for a primary identity", () => {
    const component = mount(
      <AccountApp>
        <IdentityOverviewPage identity={primaryIdentity} />
      </AccountApp>,
    );

    const updateButton = component.contains(
      <Button variant={ButtonVariant.PRIMARY}>
        Update this email address
      </Button>,
    );
    expect(updateButton).toEqual(true);
  });

  test("it should display the delete button for a non primary identity", () => {
    const component = mount(
      <AccountApp>
        <IdentityOverviewPage identity={nonPrimaryIdentity} />
      </AccountApp>,
    );

    const deleteButton = component
      .find(Button)
      .find({ variant: ButtonVariant.GHOST });
    expect(deleteButton).toHaveLength(1);
    expect(deleteButton.text()).toEqual("Delete this email address");
  });

  test("it should not display the delete button for a primary identity", () => {
    const component = mount(
      <AccountApp>
        <IdentityOverviewPage identity={primaryIdentity} />
      </AccountApp>,
    );

    const deleteButton = component
      .find(Button)
      .find({ variant: ButtonVariant.GHOST });
    expect(deleteButton).toHaveLength(0);
  });

  test("it should not display the primary badge if the identity is not primary", () => {
    const component = mount(
      <AccountApp>
        <IdentityOverviewPage identity={nonPrimaryIdentity} />
      </AccountApp>,
    );

    const primaryBadge = component.contains(<PrimaryBadge />);
    const makeThisPrimaryButton = component
      .find(Button)
      .find({ variant: ButtonVariant.SECONDARY })
      .at(0)
      .text();
    expect(primaryBadge).toEqual(false);
    expect(makeThisPrimaryButton).toEqual("Make this my primary email");
  });

  test("it should display the primary tag if the identity is primary", () => {
    const component = mount(
      <AccountApp>
        <IdentityOverviewPage identity={primaryIdentity} />
      </AccountApp>,
    );

    const makeThisPrimaryButton = component.contains(
      <Button variant={ButtonVariant.SECONDARY}>
        Make this my primary email
      </Button>,
    );
    const primaryBadge = component.contains(<PrimaryBadge />);
    const awaitingValidationBadge = component.contains(
      <AwaitingValidationBadge />,
    );
    expect(primaryBadge).toEqual(true);
    expect(awaitingValidationBadge).toEqual(false);
    expect(makeThisPrimaryButton).toEqual(false);
  });

  test("it should display the validation button and the awaiting validation tag if the identity is not validated", () => {
    const component = mount(
      <AccountApp>
        <IdentityOverviewPage identity={nonValidatedIdentity} />
      </AccountApp>,
    );

    const awaitingValidationBadge = component.contains(
      <AwaitingValidationBadge />,
    );
    const validationButton = component.contains(
      <Button variant={ButtonVariant.PRIMARY}>proceed to validation</Button>,
    );
    expect(validationButton).toEqual(true);
    expect(awaitingValidationBadge).toEqual(true);
  });

  test("it should not display the make this identity primary button if the identity is not validated", () => {
    const component = mount(
      <AccountApp>
        <IdentityOverviewPage identity={nonValidatedIdentity} />
      </AccountApp>,
    );

    const makeThisPrimaryButton = component.contains(
      <Button variant={ButtonVariant.SECONDARY}>
        Make this my primary email
      </Button>,
    );
    expect(makeThisPrimaryButton).toEqual(false);
  });

  describe("ConfirmationBox", () => {
    test("no confirmation box should be displayed at the page's render", () => {
      const component = mount(
        <AccountApp>
          <IdentityOverviewPage identity={nonPrimaryIdentity} />
        </AccountApp>,
      );

      const confirmationBox = component
        .find(ConfirmationBox)
        .find({ open: true });
      expect(confirmationBox).toHaveLength(0);
    });

    test("the primary confirmation box shoud appear on click on 'make this my primary { type }' button", () => {
      const component = mount(
        <AccountApp>
          <IdentityOverviewPage identity={nonPrimaryIdentity} />
        </AccountApp>,
      );

      const makePrimaryButton = component
        .find(Button)
        .find({ variant: ButtonVariant.SECONDARY })
        .at(0);
      makePrimaryButton.simulate("click");

      const confirmationBox = component
        .find(ConfirmationBox)
        .find({ open: true })
        .hostNodes();

      const confirmationText = confirmationBox.contains(
        <PrimaryConfirmationText>
          You are about to replace mail@mail.com as your main address
        </PrimaryConfirmationText>,
      );

      expect(confirmationBox).toHaveLength(1);
      expect(confirmationText).toEqual(true);
    });

    test("we should be able to close the confirmation box by clicking on 'keep { value } as my primary { type }' button", () => {
      const component = mount(
        <AccountApp>
          <IdentityOverviewPage identity={nonPrimaryIdentity} />
        </AccountApp>,
      );

      const makePrimaryButton = component
        .find(Button)
        .find({ variant: ButtonVariant.SECONDARY })
        .at(0);
      makePrimaryButton.simulate("click");

      const keepEmailPrimaryButton = component
        .find(ConfirmationBox)
        .find({ open: true })
        .find(Button)
        .find({ variant: ButtonVariant.SECONDARY });

      expect(keepEmailPrimaryButton.text()).toEqual(
        "Keep mail@mail.co as my primary email",
      );
      keepEmailPrimaryButton.simulate("click");

      const confirmationBox = component
        .find(ConfirmationBox)
        .find({ open: true })
        .hostNodes();

      expect(confirmationBox).toHaveLength(0);
    });

    test("we should be able to close the confirmation box by clicking on the ClickAwayListener", () => {
      const component = mount(
        <AccountApp>
          <IdentityOverviewPage identity={nonPrimaryIdentity} />
        </AccountApp>,
      );

      const makePrimaryButton = component
        .find(Button)
        .find({ variant: ButtonVariant.SECONDARY })
        .at(0);
      makePrimaryButton.simulate("click");

      const clickAwayListener = component.find(ClickAwayListener);
      expect(clickAwayListener).toHaveLength(1);
      clickAwayListener.simulate("click");

      const confirmationBox = component
        .find(ConfirmationBox)
        .find({ open: true })
        .hostNodes();

      expect(confirmationBox).toHaveLength(0);
    });

    test("the delete confirmation box shoud appear on click on 'delete this { type }' button", () => {
      const component = mount(
        <AccountApp>
          <IdentityOverviewPage identity={nonPrimaryIdentity} />
        </AccountApp>,
      );

      const deleteButton = component
        .find(Button)
        .find({ variant: ButtonVariant.GHOST })
        .at(0);
      deleteButton.simulate("click");

      const confirmationBox = component
        .find(ConfirmationBox)
        .find({ open: true })
        .hostNodes();

      const confirmationText = confirmationBox.contains(
        <DeleteConfirmationText>
          You are about to delete test@test.test
        </DeleteConfirmationText>,
      );

      expect(confirmationBox).toHaveLength(1);
      expect(confirmationText).toEqual(true);
    });

    test("we should be able to close the confirmation box by clicking on 'keep { type }' button", () => {
      const component = mount(
        <AccountApp>
          <IdentityOverviewPage identity={nonPrimaryIdentity} />
        </AccountApp>,
      );

      const deleteButton = component
        .find(Button)
        .find({ variant: ButtonVariant.GHOST })
        .at(0);
      deleteButton.simulate("click");

      const keepEmailButton = component
        .find(ConfirmationBox)
        .find({ open: true })
        .find(Button)
        .find({ variant: ButtonVariant.SECONDARY });

      expect(keepEmailButton.text()).toEqual("Keep email address");
      keepEmailButton.simulate("click");

      const confirmationBox = component
        .find(ConfirmationBox)
        .find({ open: true })
        .hostNodes();

      expect(confirmationBox).toHaveLength(0);
    });

    test("we should be able to close the confirmation box by clicking on the ClickAwayListener", () => {
      const component = mount(
        <AccountApp>
          <IdentityOverviewPage identity={nonPrimaryIdentity} />
        </AccountApp>,
      );

      const deleteButton = component
        .find(Button)
        .find({ variant: ButtonVariant.GHOST })
        .at(0);
      deleteButton.simulate("click");

      const clickAwayListener = component.find(ClickAwayListener);
      expect(clickAwayListener).toHaveLength(1);
      clickAwayListener.simulate("click");

      const confirmationBox = component
        .find(ConfirmationBox)
        .find({ open: true })
        .hostNodes();

      expect(confirmationBox).toHaveLength(0);
    });

    test("clicking on the delete button should delete the identity", () => {
      const component = mount(
        <AccountApp>
          <IdentityOverviewPage identity={nonPrimaryIdentity} />
        </AccountApp>,
      );

      const fetchMethod = jest.spyOn(fetchJson, "fetchJson");

      const deleteButton = component
        .find(Button)
        .find({ variant: ButtonVariant.GHOST })
        .at(0);
      deleteButton.simulate("click");

      const confirmDeleteButton = component
        .find(ConfirmationBox)
        .find(Button)
        .find({ variant: ButtonVariant.DANGER });

      expect(confirmDeleteButton.text()).toEqual("Delete this email address");
      confirmDeleteButton.simulate("click");

      expect(fetchMethod).toHaveBeenCalledWith("/api/identities", "DELETE", {
        type: "EMAIL",
        userId: undefined,
        value: "test@test.test",
      });
    });
  });
});
