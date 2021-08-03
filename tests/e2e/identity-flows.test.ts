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

import { authenticateToConnect } from "./utils/authenticate-to-connect";
import { getCode } from "./utils/check-verification-code";
import * as locales from "@content/locales";

const step = (step: string, title = false): void => {
  process.stdout.write(
    title
      ? `🤖\u001b[1m${step.toUpperCase()}\u001b[0m\n`
      : `🤖\u001b[33m Test step:\u001b[0m\u001b[32m ${step}\u001b[0m\n`,
  );
};

describe("Identity flows", () => {
  jest.setTimeout(180000);

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
      step("identities CRUD flows", true);

      await authenticateToConnect();
      step("Login done");

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

      step("Email submit");
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
      await checkBox(below(newEmailAddress)).check();
      await checkBox(below(newEmailAddress)).uncheck();
      await click(checkBox(below(newEmailAddress)));
      await click(localizedStrings.createIdentity.addEmail);

      step("Email confirm");
      expect(
        await text(localizedAlertMessagesStrings.confirmationCodeEmail).exists(
          50,
          3000,
        ),
      ).toBe(true);

      await waitFor(1000);
      const code = await getCode(newEmailAddress);
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

      step("Email mark as primary");

      await click(text(localizedStrings.identitiesOverview.showMore));
      await click(process.env.CONNECT_TEST_ACCOUNT_EMAIL || "");
      await click(localizedStrings.identityOverview.markEmail);

      await waitFor(1000);
      await click(
        button(localizedStrings.identityOverview.primaryModalConfirm),
      );

      await waitFor(1000);

      step("Email update");

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
      await write(await getCode(updatedEmailAddress));
      await click("Confirm email", { waitForEvents: ["loadEventFired"] });

      await waitFor(2000);
      await click(text(localizedStrings.identitiesOverview.showMore));
      expect(await text(updatedEmailAddress).exists()).toBe(true);

      step("Email delete");

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
