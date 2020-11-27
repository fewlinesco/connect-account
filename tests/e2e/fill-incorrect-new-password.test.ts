import {
  openBrowser,
  closeBrowser,
  goto,
  text,
  click,
  write,
  screenshot,
  waitFor,
  focus,
  textBox,
  clear,
} from "taiko";

import { authToConnect } from "./utils/authToConnect";

describe("Account Web Application update password", () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    await openBrowser({
      args: [
        "--window-size=1440,1000",
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
      headless: true,
    });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("should show error messages if password inputs are filled incorrectly", async (done) => {
    expect.assertions(11);

    if (process.env.CONNECT_ACCOUNT_TEST_URL === undefined) {
      throw new Error(
        "CONNECT_ACCOUNT_TEST_URL environment variable is undefined",
      );
    }

    try {
      await goto(process.env.CONNECT_ACCOUNT_TEST_URL);

      await authToConnect();

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
      await click("Update password");
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
      await click("Update password");
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
