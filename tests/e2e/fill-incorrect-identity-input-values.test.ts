import {
  openBrowser,
  closeBrowser,
  goto,
  text,
  click,
  screenshot,
  waitFor,
  textBox,
  focus,
  write,
} from "taiko";

import { authenticateToConnect } from "./utils/authenticate-to-connect";
import { config } from "@src/config";

describe("Account Web Application add identity", () => {
  jest.setTimeout(30000);

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

  test("should show error messages if identity inputs are filled incorrectly", async (done) => {
    expect.assertions(8);

    try {
      await authenticateToConnect();

      await waitFor("LOGINS");
      expect(await text("LOGINS").exists()).toBeTruthy();
      await click("LOGINS");

      await waitFor("Add new email address");
      await click("Add new email address");
      await waitFor("Email address *");
      expect(await text("Email address *").exists()).toBeTruthy();

      await click("Add email");
      await waitFor("Identity input can't be blank");
      expect(await text("Identity input can't be blank").exists()).toBeTruthy();

      const baseUrl =
        process.env.CONNECT_TEST_ACCOUNT_URL || config.connectAccountURL + "/";

      await goto(`${baseUrl}account/logins/phone/new`);

      await waitFor("Phone number *");
      expect(await text("Phone number *").exists()).toBeTruthy();
      await focus(textBox({ placeholder: "Enter your phone number" }));
      await write("000000000000000000000000000000");
      await click("Add phone");
      await waitFor("Invalid phone number format input.");
      expect(
        await text("Invalid phone number format input.").exists(),
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
