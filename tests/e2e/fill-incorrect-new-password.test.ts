import {
  openBrowser,
  closeBrowser,
  goto,
  text,
  click,
  write,
  press,
  screenshot,
  waitFor,
  focus,
  textBox,
  clear,
} from "taiko";

import { config } from "@src/config";

describe("Account Web Application update password", () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    await openBrowser({ args: ["--window-size=1440,1000"], headless: true });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("should show error messages if password inputs are filled incorrectly", async (done) => {
    expect.assertions(11);

    try {
      await goto("http://localhost:29703");
      await waitFor("Access my account");
      expect(await text("Access my account").exists()).toBeTruthy();

      await click("Access my account");
      await waitFor("Email");
      expect(await text("Email").exists()).toBeTruthy();

      await write(config.connectTestAccountEmail);
      await press("Enter");
      await waitFor("Password");
      expect(await text("Password").exists()).toBeTruthy();

      await write(config.connectTestAccountPassword);
      await press("Enter");
      await waitFor("SECURITY");
      expect(await text("SECURITY").exists()).toBeTruthy();

      await click("SECURITY");
      await waitFor("Update your password");
      expect(await text("Update your password").exists()).toBeTruthy();

      await click("Update your password");
      await waitFor("New password");
      expect(await text("New password").exists()).toBeTruthy();

      await focus(textBox({ placeholder: "New password" }));
      await write("q");
      await focus(textBox({ placeholder: "Confirm new password" }));
      await write("qq");
      await click("Edit password");
      await waitFor(
        "Your password confirmation do not match your new password.",
      );
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
      await click("Edit password");
      await waitFor("The password you enter does not meet the criteria.");
      expect(
        await text(
          "The password you enter does not meet the criteria.",
        ).exists(),
      ).toBeTruthy();
      expect(await text("1 digit").exists()).toBeTruthy();
      expect(await text("1 non-digit").exists()).toBeTruthy();
      expect(await text("8 characters").exists()).toBeTruthy();

      done();
    } catch (error) {
      await screenshot({
        path: "tests/e2e/screenshots/fill-incorrect-new-password.test.png",
      });

      done(error);
    }
  });
});
