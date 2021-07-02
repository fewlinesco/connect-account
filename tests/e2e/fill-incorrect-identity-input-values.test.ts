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

  describe("AddIdentity", () => {
    const localizedStrings = locales.en["/account/logins/[type]/new"];

    test("It should show error messages if Identity inputs are filled incorrectly in add identity", async () => {
      expect.assertions(9);

      try {
        await authenticateToConnect();

        await click("LOGINS");

        await click(localizedStrings.addEmail);
        expect(
          await text(localizedStrings.emailInputLabel).exists(),
        ).toBeTruthy();

        await click(localizedStrings.addEmail);
        expect(
          await text(localizedErrorStrings.identityInputCantBeBlank).exists(),
        ).toBeTruthy();

        await write(
          process.env.CONNECT_TEST_ACCOUNT_EMAIL ||
            configVariables.connectTestAccountEmail,
          into(textBox({ placeholder: localizedStrings.emailPlaceholder })),
        );
        await click(localizedStrings.addEmail);
        expect(
          await text(localizedErrorStrings.somethingWrong).exists(),
        ).toBeTruthy();

        await click("LOGINS");
        await click("+ Add new phone number");
        expect(
          await text(localizedStrings.phoneInputLabel).exists(),
        ).toBeTruthy();

        await click(localizedStrings.addPhone);
        expect(
          await text(localizedErrorStrings.identityInputCantBeBlank).exists(),
        ).toBeTruthy();

        await write(
          "000000000000000000000000000000",
          into(textBox({ placeholder: localizedStrings.phonePlaceholder })),
        );
        await click("Add phone");
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
    const localizedStrings = locales.en["/account/logins/[type]/[id]/update"];

    test("It should show error messages if Identity inputs are filled incorrectly in update identity", async () => {
      expect.assertions(3);

      try {
        await click("LOGINS");
        await click("Show");
        expect(await text("Hide").exists()).toBeTruthy();

        const identityToUpdate = await link(".test", above("Hide")).text();
        await click(identityToUpdate);

        await click(localizedStrings.updateEmail);
        await click("Update email");
        expect(
          await text(localizedErrorStrings.identityInputCantBeBlank).exists(),
        ).toBeTruthy();

        await write(
          identityToUpdate,
          into(textBox({ placeholder: localizedStrings.emailPlaceholder })),
        );
        await click("Update email");
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
