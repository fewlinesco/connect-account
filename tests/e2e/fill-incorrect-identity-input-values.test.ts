import {
  openBrowser,
  closeBrowser,
  text,
  click,
  screenshot,
  textBox,
  write,
  into,
  link,
  above,
} from "taiko";

import { authenticateToConnect } from "./utils/authenticate-to-connect";
import * as locales from "@content/locales";
import { configVariables } from "@src/configs/config-variables";

describe("Fill incorrect identity input values", () => {
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

  const localizedErrorStrings = locales.en.errors;
  const localizedStrings = {
    accountOverview: locales.en["/account"],
    identitiesOverview: locales.en["/account/logins"],
    identityOverview: locales.en["/account/logins/[type]/[id]"],
    newIdentity: locales.en["/account/logins/[type]/new"],
    updateIdentity: locales.en["/account/logins/[type]/[id]/update"],
  };

  describe("AddIdentity", () => {
    test("It should show error messages if Identity inputs are filled incorrectly in add identity", async () => {
      expect.assertions(9);

      try {
        await authenticateToConnect();

        await click(localizedStrings.accountOverview.loginsTitle);

        await click(
          localizedStrings.identitiesOverview.emailAddNewIdentityMessage,
        );
        expect(
          await text(localizedStrings.newIdentity.emailInputLabel).exists(),
        ).toBeTruthy();

        await click(localizedStrings.newIdentity.addEmail);
        expect(
          await text(localizedErrorStrings.identityInputCantBeBlank).exists(),
        ).toBeTruthy();

        await write(
          process.env.CONNECT_TEST_ACCOUNT_EMAIL ||
            configVariables.connectTestAccountEmail,
          into(
            textBox({
              placeholder: localizedStrings.newIdentity.emailPlaceholder,
            }),
          ),
        );
        await click(localizedStrings.newIdentity.addEmail);
        expect(
          await text(localizedErrorStrings.somethingWrong).exists(),
        ).toBeTruthy();

        await click("LOGINS");
        await click(
          localizedStrings.identitiesOverview.phoneAddNewIdentityMessage,
        );
        expect(
          await text(localizedStrings.newIdentity.phoneInputLabel).exists(),
        ).toBeTruthy();

        await click(localizedStrings.newIdentity.addPhone);
        expect(
          await text(localizedErrorStrings.identityInputCantBeBlank).exists(),
        ).toBeTruthy();

        await write(
          "000000000000000000000000000000",
          into(
            textBox({
              placeholder: localizedStrings.newIdentity.phonePlaceholder,
            }),
          ),
        );
        await click(localizedStrings.newIdentity.addPhone);
        expect(
          await text(localizedErrorStrings.invalidPhoneNumberInput).exists(),
        ).toBeTruthy();
      } catch (error) {
        await screenshot({
          path: "./tests/e2e/screenshots/fill-incorrect-add-identity-input-values.test.png",
        });

        throw error;
      }
    });
  });

  describe("UpdateIdentity", () => {
    test("It should show error messages if Identity inputs are filled incorrectly in update identity", async () => {
      expect.assertions(3);

      try {
        await click(localizedStrings.accountOverview.loginsTitle);
        await click(localizedStrings.identitiesOverview.showMore);
        expect(
          await text(localizedStrings.identitiesOverview.hide).exists(),
        ).toBeTruthy();

        const identityToUpdate = await link(
          ".test",
          above(localizedStrings.identitiesOverview.hide),
        ).text();
        await click(identityToUpdate);

        await click(localizedStrings.identityOverview.updateEmail);
        await click(localizedStrings.updateIdentity.updateEmail);
        expect(
          await text(localizedErrorStrings.identityInputCantBeBlank).exists(),
        ).toBeTruthy();

        await write(
          identityToUpdate,
          into(
            textBox({
              placeholder: localizedStrings.updateIdentity.emailPlaceholder,
            }),
          ),
        );
        await click(localizedStrings.updateIdentity.updateEmail);
        expect(
          await text(localizedErrorStrings.somethingWrong).exists(),
        ).toBeTruthy();
      } catch (error) {
        await screenshot({
          path: "./tests/e2e/screenshots/fill-incorrect-update-identity-input-values.test.png",
        });

        throw error;
      }
    });
  });
});
