import {
  openBrowser,
  closeBrowser,
  text,
  click,
  screenshot,
  below,
  waitFor,
  write,
  into,
  textBox,
  button,
  checkBox,
} from "taiko";

import {
  authenticateToConnect,
  getEmailValidationCode,
  printStep,
} from "./utils";
import * as locales from "@content/locales";

describe("Identity flows", () => {
  jest.setTimeout(750000);

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
    accountOverview: locales.en["/account"],
    identitiesOverview: locales.en["/account/logins"],
    identityOverview: locales.en["/account/logins/[type]/[id]"],
    createIdentity: locales.en["/account/logins/[type]/new"],
    updateIdentity: locales.en["/account/logins/[type]/[id]/update"],
  };

  it("Should be able to create a new identity", async () => {
    try {
      expect.assertions(6);

      printStep("identities CRUD flows", true);
      await authenticateToConnect();

      await click(localizedStrings.identitiesOverview.title);
      await waitFor(1000);

      const initialLoginsCount = await (async () => {
        const showMore = await text(
          localizedStrings.identitiesOverview.showMore,
        );
        const showMoreExists = await showMore.exists(0, 0);
        return showMoreExists
          ? +(await showMore.text()).replace(/[^\d]/g, "")
          : 0;
      })();

      printStep("Email submit");
      await click(
        localizedStrings.identitiesOverview.emailAddNewIdentityMessage,
      );
      const newEmailAddress = `new-${process.env.CONNECT_TEST_ACCOUNT_EMAIL}`;
      await write(
        newEmailAddress,
        into(
          textBox({
            placeholder: localizedStrings.createIdentity.emailPlaceholder,
          }),
        ),
      );
      await click(checkBox(below(newEmailAddress)));
      await click(localizedStrings.createIdentity.addEmail);

      printStep("Email confirm");
      expect(
        await text(localizedAlertMessagesStrings.confirmationCodeEmail).exists(
          50,
          3000,
        ),
      ).toBe(true);

      await waitFor(1000);
      const code = await getEmailValidationCode(newEmailAddress);
      await write(code);

      await click("Confirm email", { waitForEvents: ["loadEventFired"] });

      await waitFor(1000);
      const newLoginsCount = await (async () => {
        const content = await (
          await text(localizedStrings.identitiesOverview.showMore)
        ).text();
        return +content.replace(/[^\d]/g, "");
      })();
      expect(newLoginsCount).toBe(initialLoginsCount + 1);
      expect(await text(newEmailAddress).exists()).toBe(true);

      printStep("Email mark as primary");

      await click(text(localizedStrings.identitiesOverview.showMore));
      await click(process.env.CONNECT_TEST_ACCOUNT_EMAIL || "");
      await click(localizedStrings.identityOverview.markEmail);

      await waitFor(1000);
      await click(
        button(localizedStrings.identityOverview.primaryModalConfirm),
      );

      await waitFor(1000);

      printStep("Email update");

      await click(text(localizedStrings.identitiesOverview.showMore));
      await click(newEmailAddress);
      await click(localizedStrings.identityOverview.updateEmail);

      const updatedEmailAddress = `updated-${newEmailAddress}`;
      await write(
        updatedEmailAddress,
        into(
          textBox({
            placeholder: localizedStrings.updateIdentity.emailPlaceholder,
          }),
        ),
      );

      await click(localizedStrings.identityOverview.updateEmail);

      await waitFor(1000);
      await write(await getEmailValidationCode(updatedEmailAddress));
      await click("Confirm email", { waitForEvents: ["loadEventFired"] });

      await waitFor(2000);
      await click(text(localizedStrings.identitiesOverview.showMore));
      expect(await text(updatedEmailAddress).exists()).toBe(true);

      printStep("Email delete");

      await click(updatedEmailAddress);

      await click(localizedStrings.identityOverview.deleteEmail);
      await click(localizedStrings.identityOverview.deleteModalConfirm);

      expect(
        await text(localizedAlertMessagesStrings.emailDeleted).exists(),
      ).toBe(true);
      await waitFor(1000);

      const showMore = await text(localizedStrings.identitiesOverview.showMore);
      const showMoreExists = await showMore.exists(0, 0);

      const loginsCountAfterDelete = showMoreExists
        ? +(await showMore.text()).replace(/[^\d]/g, "")
        : 0;

      expect(loginsCountAfterDelete).toBe(initialLoginsCount);
    } catch (error) {
      await screenshot({
        path: "./tests/e2e/screenshots/identity-flows.png",
      });

      throw error;
    }
  });
});
