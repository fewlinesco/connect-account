import {
  openBrowser,
  closeBrowser,
  text,
  click,
  screenshot,
  link,
  below,
  above,
} from "taiko";

import { authenticateToConnect } from "./utils/authenticate-to-connect";
import * as locales from "@content/locales";

describe("Mark Identity as primary", () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    await openBrowser({
      args: [
        "--window-size=1440,1000",
        "--no-sandbox",
        "--start-maximized",
        "--disable-dev-shm",
      ],
      headless: true,
      observe: false,
      observeTime: 2000,
    });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  const localizedAlertMessagesStrings = locales.en.alertMessages;
  const localizedStrings = {
    accountOverview: locales.en["/account"],
    identitiesOverview: locales.en["/account/logins"],
    identityOverview: locales.en["/account/logins/[type]/[id]"],
  };

  test("It should correctly mark another identity to primary status and going back to logins overview page", async () => {
    expect.assertions(3);

    try {
      await authenticateToConnect();

      await click(localizedStrings.accountOverview.loginsTitle);

      await click(localizedStrings.identitiesOverview.showMore);

      expect(
        await text(localizedStrings.identitiesOverview.hide).exists(),
      ).toBeTruthy();

      const primaryIdentity = await link(
        "",
        below(localizedStrings.identitiesOverview.emailTitle),
      ).text();

      const nonPrimaryYet = (
        await link("", below(primaryIdentity)).text()
      ).includes("_delete_")
        ? await link("", above(localizedStrings.identitiesOverview.hide)).text()
        : await link("", below(primaryIdentity)).text();

      await click(nonPrimaryYet);
      await click(localizedStrings.identityOverview.markEmail);
      await click(localizedStrings.identityOverview.primaryModalConfirm);
      expect(
        await text(
          `${nonPrimaryYet} ${localizedAlertMessagesStrings.emailMarkedAsPrimary}`,
        ).exists(),
      ).toBeTruthy();

      await click(
        link("", below(localizedStrings.identitiesOverview.emailTitle)),
      );

      expect(text(nonPrimaryYet)).toBeTruthy();
    } catch (error) {
      await screenshot({
        path: "./tests/e2e/screenshots/mark-identity-as-primary.test.png",
      });

      throw error;
    }
  });
});
