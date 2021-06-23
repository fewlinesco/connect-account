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
        await text(
          "Your password confirmation do not match your new password.",
        ).exists(),
      ).toBeTruthy();

      await focus(textBox({ placeholder: "New password" }));
      await clear(textBox({ placeholder: "New password" }));
      await write("q");

      await focus(textBox({ placeholder: "Confirm new password" }));
      await clear(textBox({ placeholder: "Confirm new password" }));
      await write("q");

      await click("Update password");
      expect(
        await text(
          "The password you enter does not meet the criteria.",
        ).exists(),
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
      expect(await text("Password can't be blank.").exists()).toBeTruthy();
    } catch (error) {
      await screenshot({
        path: "./tests/e2e/screenshots/password-flow.test.png",
      });

      throw error;
    }
  });
});
