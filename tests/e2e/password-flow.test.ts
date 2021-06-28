import {
  openBrowser,
  closeBrowser,
  text,
  click,
  write,
  screenshot,
  focus,
  textBox,
  clear,
} from "taiko";

import { authenticateToConnect } from "./utils/authenticate-to-connect";
import * as locales from "@content/locales";

describe("Account Web Application update password", () => {
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

  test("It should show error messages if password inputs are filled incorrectly", async () => {
    expect.assertions(12);

    try {
      await authenticateToConnect();

      expect(await text("SECURITY").exists()).toBeTruthy();
      await click("SECURITY");

      expect(await text("Update your password").exists()).toBeTruthy();
      await click("Update your password");

      expect(await text("New password").exists()).toBeTruthy();

      await focus(textBox({ placeholder: "New password" }));
      await write("q");

      await focus(textBox({ placeholder: "Confirm new password" }));
      await write("qq");

      await click("Update password");
      expect(
        await text(localizedErrorStrings.passwordMatch).exists(),
      ).toBeTruthy();

      await focus(textBox({ placeholder: "New password" }));
      await clear(textBox({ placeholder: "New password" }));
      await write("q");

      await focus(textBox({ placeholder: "Confirm new password" }));
      await clear(textBox({ placeholder: "Confirm new password" }));
      await write("q");

      await click("Update password");
      expect(
        await text(localizedErrorStrings.passwordCriteria).exists(),
      ).toBeTruthy();
      expect(await text("1 digit").exists()).toBeTruthy();
      expect(await text("1 non-digit").exists()).toBeTruthy();
      expect(await text("8 characters").exists()).toBeTruthy();

      await focus(textBox({ placeholder: "New password" }));
      await clear(textBox({ placeholder: "New password" }));
      await write("");
      await focus(textBox({ placeholder: "Confirm new password" }));
      await clear(textBox({ placeholder: "Confirm new password" }));
      await write("");
      await click("Update password");
      expect(
        await text(localizedErrorStrings.blankPassword).exists(),
      ).toBeTruthy();
    } catch (error) {
      await screenshot({
        path: "./tests/e2e/screenshots/password-flow.test.png",
      });

      throw error;
    }
  });
});
