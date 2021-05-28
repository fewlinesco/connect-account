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
import { configVariables } from "@src/configs/config-variables";

describe("Account Web Application add identity", () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    await openBrowser({
      args: [
        "--window-size=1440,1000",
        "--no-sandbox",
        "--start-maximized",
        "--disable-dev-shm",
      ],
      headless: false,
      observe: false,
      observeTime: 2000,
    });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("It should show error messages if Identity inputs are filled incorrectly in add identity", async (done) => {
    expect.assertions(10);

    try {
      await authenticateToConnect();

      expect(await text("LOGINS").exists()).toBeTruthy();
      await click("LOGINS");

      expect(await text("taiko").exists()).toBeTruthy();

      await click("Add new email address");
      expect(await text("Email address *").exists()).toBeTruthy();

      await click("Add email");
      expect(await text("Identity input can't be blank").exists()).toBeTruthy();

      await write(
        process.env.CONNECT_TEST_ACCOUNT_EMAIL ||
          configVariables.connectTestAccountEmail,
        into(textBox({ placeholder: "Enter your email" })),
      );
      await click("Add email");
      expect(await text("Something went wrong").exists()).toBeTruthy();

      await click("LOGINS");
      await click("+ Add new phone number");
      expect(await text("Phone number *").exists()).toBeTruthy();

      await click("Add phone");
      expect(await text("Identity input can't be blank").exists()).toBeTruthy();

      await write(
        "000000000000000000000000000000",
        into(textBox({ placeholder: "Enter your phone number" })),
      );
      await click("Add phone");
      expect(
        await text("Invalid phone number format input.").exists(),
      ).toBeTruthy();
    } catch (error) {
      await screenshot({
        path: "tests/e2e/screenshots/fill-incorrect-add-identity-input-values.test.png",
      });

      done(error);
    }
  });

  test("It should show error messages if Identity inputs are filled incorrectly in update identity", async (done) => {
    expect.assertions(6);

    try {
      expect(await text("LOGINS").exists()).toBeTruthy();
      await click("LOGINS");

      await click("Show");
      expect(await text("Hide").exists()).toBeTruthy();
      const nonPrimaryYet = await link(".test", above("Hide")).text();
      await click(nonPrimaryYet);

      expect(await text("Update this email address").exists()).toBeTruthy();
      await click("Update this email address");

      await click("Update email");
      expect(await text("Identity input can't be blank").exists()).toBeTruthy();

      await write(
        nonPrimaryYet,
        into(textBox({ placeholder: "Enter your email" })),
      );

      expect(await text("Update email").exists()).toBeTruthy();
      await click("Update email");

      expect(await text("Something went wrong").exists()).toBeTruthy();
    } catch (error) {
      await screenshot({
        path: "tests/e2e/screenshots/fill-incorrect-update-identity-input-values.test.png",
      });

      done(error);
    }
  });
});
