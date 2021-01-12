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
} from "taiko";

import { authenticateToConnect } from "./utils/authenticate-to-connect";
import { config } from "@src/config";

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
    });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("should show error messages if password inputs are filled incorrectly", async (done) => {
    expect.assertions(9);

    try {
      await authenticateToConnect();

      await waitFor("LOGINS");
      expect(await text("LOGINS").exists()).toBeTruthy();
      await click("LOGINS");

      await waitFor("Add new email address");
      await click("Add new email address");
      await waitFor("email address *");
      expect(await text("email address *").exists()).toBeTruthy();

      await click("Add email");
      await waitFor("Identity value can't be blank.");
      expect(
        await text("Identity value can't be blank.").exists(),
      ).toBeTruthy();

      await focus(textBox({ placeholder: "Enter your email" }));
      await write(config.connectTestAccountEmail);
      await click("Add email");
      await waitFor("Identity has already been validated by a user.");
      expect(
        await text("Identity has already been validated by a user.").exists(),
      ).toBeTruthy();

      const baseUrl =
        process.env.CONNECT_TEST_ACCOUNT_URL || config.connectAccountURL + "/";

      await goto(`${baseUrl}account/logins/phone/new`);

      await waitFor("phone number *");
      expect(await text("phone number *").exists()).toBeTruthy();

      await focus(textBox({ placeholder: "Enter your phone" }));
      await write("foo");
      await click("Add phone");
      await waitFor("Phone identity value should be a number.");
      expect(
        await text("Phone identity value should be a number.").exists(),
      ).toBeTruthy();

      done();
    } catch (error) {
      await screenshot({
        path:
          "tests/e2e/screenshots/fill-incorrect-identity-input-values.test.png",
      });

      done(error);
    }
  });
});
