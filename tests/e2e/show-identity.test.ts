import {
  openBrowser,
  closeBrowser,
  goto,
  text,
  click,
  write,
  press,
  screenshot,
} from "taiko";

import { config } from "@src/config";

jest.setTimeout(10000);

describe("Account Web Application happy path", () => {
  beforeAll(async () => {
    await openBrowser({ headless: true });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("Launch the browser and go to the login page", async () => {
    expect.assertions(1);

    try {
      await goto("http://localhost:29703");

      expect(text("Login").exists()).toBeTruthy();
    } catch (error) {
      await screenshot({ path: "tests/e2e/screenshots/launch.png" });

      throw error;
    }
  });

  describe("Perform the authentification", () => {
    test("click the login button", async () => {
      expect.assertions(1);

      try {
        await click("Login");

        expect(text("Email").exists()).toBeTruthy();
      } catch (error) {
        await screenshot({
          path: "tests/e2e/screenshots/click_login_btn.png",
        });

        throw error;
      }
    });

    test("enter email ", async () => {
      expect.assertions(1);

      try {
        await write(config.connectTestAccountEmail);
        await press("Enter");

        expect(text("Password").exists()).toBeTruthy();
      } catch (error) {
        await screenshot({ path: "tests/e2e/screenshots/enter_email.png" });

        throw error;
      }
    });

    test("enter password ", async () => {
      expect.assertions(1);

      try {
        await write(config.connectTestAccountPassword);
        await press("Enter");

        expect(
          text(
            "Manage your logins options, including emails, phone numbers and social logins",
          ).exists(),
        ).toBeTruthy();
      } catch (error) {
        await screenshot({ path: "tests/e2e/screenshots/enter_password.png" });

        throw error;
      }
    });

    test("click the login anchor", async () => {
      expect.assertions(1);

      try {
        await click("Logins");

        expect(
          text("Your emails, phones and social logins").exists(),
        ).toBeTruthy();
      } catch (error) {
        await screenshot({
          path: "tests/e2e/screenshots/click_login_btn.png",
        });

        throw error;
      }
    });

    test("click the primary email anchor", async () => {
      expect.assertions(1);

      try {
        await click("taiko@2e2.test");

        expect(text("Primary").exists()).toBeTruthy();
      } catch (error) {
        await screenshot({
          path: "tests/e2e/screenshots/click_login_btn.png",
        });

        throw error;
      }
    });
  });
});
