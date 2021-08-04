import {
  openBrowser,
  closeBrowser,
  text,
  click,
  screenshot,
  link,
  below,
} from "taiko";

import { authenticateToConnect } from "./utils/authenticate-to-connect";
import * as locales from "@content/locales";

describe("Delete Identity", () => {
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
      observe: true,
      observeTime: 500,
    });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  const localizedAlertMessagesStrings = locales.en.alertMessages;
  const localizedStrings = {
    accountOverview: locales.en["/account/"],
    identitiesOverview: locales.en["/account/logins/"],
    identityOverview: locales.en["/account/logins/[type]/[id]/"],
  };

  test("It should navigate to the show of the Identity, and delete it", async () => {
    expect.assertions(6);

    try {
      await authenticateToConnect();

      await click(localizedStrings.accountOverview.loginsTitle);

      await click(localizedStrings.identitiesOverview.showMore);

      await click(link("_delete_"));

      await click(text(localizedStrings.identityOverview.deleteEmail));

      expect(
        await text(
          localizedStrings.identityOverview.deleteModalContentEmail,
        ).exists(),
      ).toBeTruthy();
      await click(localizedStrings.identityOverview.deleteModalConfirm);

      expect(
        await text(localizedAlertMessagesStrings.emailDeleted).exists(),
      ).toBeTruthy();

      await click(localizedStrings.identitiesOverview.showMore);

      expect(
        await text(localizedStrings.identitiesOverview.hide).exists(),
      ).toBeTruthy();

      const primaryIdentity = await link(
        "",
        below(localizedStrings.identitiesOverview.emailTitle),
      ).text();

      const secondIdentity = await link("", below(primaryIdentity)).text();

      const thirdLink = await link("", below(secondIdentity)).text();

      expect(secondIdentity.includes("_delete_")).toBeFalsy();
      expect(primaryIdentity.includes("_delete_")).toBeFalsy();
      expect(thirdLink.includes("_delete_")).toBeFalsy();
    } catch (error) {
      await screenshot({
        path: "./tests/e2e/screenshots/delete-identity.png",
      });

      throw error;
    }
  });
});
