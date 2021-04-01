import {
  openBrowser,
  closeBrowser,
  text,
  click,
  screenshot,
  waitFor,
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
      headless: true,
    });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("It should show error messages if Identity inputs are filled incorrectly in add identity", async (done) => {
    expect.assertions(10);

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

      await write(
        process.env.CONNECT_TEST_ACCOUNT_EMAIL ||
          configVariables.connectTestAccountEmail,
        into(textBox({ placeholder: "Enter your email" })),
      );
      await click("Add email");
      await waitFor("Something went wrong");
      expect(await text("Something went wrong").exists()).toBeTruthy();

      await click("LOGINS");
      await click("+ Add new phone number");

      await waitFor("Phone number *");
      expect(await text("Phone number *").exists()).toBeTruthy();

      await click("Add phone");
      await waitFor("Identity input can't be blank");
      expect(await text("Identity input can't be blank").exists()).toBeTruthy();

      await write(
        "000000000000000000000000000000",
        into(textBox({ placeholder: "Enter your phone number" })),
      );
      await click("Add phone");
      await waitFor("Invalid phone number format input.");
      expect(
        await text("Invalid phone number format input.").exists(),
      ).toBeTruthy();

      done();
    } catch (error) {
      await screenshot({
        path:
          "tests/e2e/screenshots/fill-incorrect-add-identity-input-values.test.png",
      });

      done(error);
    }
  });

  test("It should show error messages if Identity inputs are filled incorrectly in update identity", async (done) => {
    expect.assertions(6);

    try {
      await waitFor("LOGINS");
      expect(await text("LOGINS").exists()).toBeTruthy();
      await click("LOGINS");

      await click("Show");
      expect(await text("Hide").exists()).toBeTruthy();
      const nonPrimaryYet = await link(".test", above("Hide")).text();
      await click(nonPrimaryYet);

      expect(await text("Update this email address").exists()).toBeTruthy();
      await click("Update this email address");

      await waitFor("New email address *");

      await click("Update email");
      await waitFor("Identity input can't be blank");
      expect(await text("Identity input can't be blank").exists()).toBeTruthy();

      await write(
        nonPrimaryYet,
        into(textBox({ placeholder: "Enter your email" })),
      );

      expect(await text("Update email").exists()).toBeTruthy();
      await click("Update email");

      await waitFor("Something went wrong");
      expect(await text("Something went wrong").exists()).toBeTruthy();

      done();
    } catch (error) {
      await screenshot({
        path:
          "tests/e2e/screenshots/fill-incorrect-update-identity-input-values.test.png",
      });

      done(error);
    }
  });
});
