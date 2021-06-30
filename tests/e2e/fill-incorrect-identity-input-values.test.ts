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

  test("It should show error messages if Identity inputs are filled incorrectly in add identity", async () => {
    expect.assertions(9);

    try {
      await authenticateToConnect();

      await click("LOGINS");

      await click("Add new email address");
      expect(await text("Email address *").exists()).toBeTruthy();

      await click("Add email");
      expect(
        await text(localizedErrorStrings.identityInputCantBeBlank).exists(),
      ).toBeTruthy();

      await write(
        process.env.CONNECT_TEST_ACCOUNT_EMAIL ||
          configVariables.connectTestAccountEmail,
        into(textBox({ placeholder: "Enter your email" })),
      );
      await click("Add email");
      expect(
        await text(localizedErrorStrings.somethingWrong).exists(),
      ).toBeTruthy();

      await click("LOGINS");
      await click("+ Add new phone number");
      expect(await text("Phone number *").exists()).toBeTruthy();

      await click("Add phone");
      expect(
        await text(localizedErrorStrings.identityInputCantBeBlank).exists(),
      ).toBeTruthy();

      await write(
        "000000000000000000000000000000",
        into(textBox({ placeholder: "Enter your phone number" })),
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

  test("It should show error messages if Identity inputs are filled incorrectly in update identity", async () => {
    expect.assertions(3);

    try {
      await click("LOGINS");
      await click("Show");
      expect(await text("Hide").exists()).toBeTruthy();

      const identityToUpdate = await link(".test", above("Hide")).text();
      await click(identityToUpdate);

      await click("Update this email address");
      await click("Update email");
      expect(
        await text(localizedErrorStrings.identityInputCantBeBlank).exists(),
      ).toBeTruthy();

      await write(
        identityToUpdate,
        into(textBox({ placeholder: "Enter your email" })),
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
