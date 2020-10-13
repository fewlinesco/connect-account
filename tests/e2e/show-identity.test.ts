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
} from "taiko";

import { config } from "@src/config";

describe("Account Web Application happy path", () => {
  const headless = true;
  let waitTime = 0;
  jest.setTimeout(10000);

  if (!headless) {
    jest.setTimeout(30000);

    waitTime = 5000;
  }

  beforeAll(async () => {
    await openBrowser({ headless });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("Launch the browser and go to the primary email identity show", async (done) => {
    expect.assertions(6);

    try {
      await goto("http://localhost:29703");
      waitFor(5000);
      expect(text("Login").exists()).toBeTruthy();

      await click("Login");
      waitFor(waitTime);
      expect(text("Email").exists()).toBeTruthy();

      await write(config.connectTestAccountEmail);
      await press("Enter");
      waitFor(waitTime);
      expect(text("Password").exists()).toBeTruthy();

      await write(config.connectTestAccountPassword);
      await press("Enter");
      waitFor(waitTime);
      expect(
        text(
          "Manage your logins options, including emails, phone numbers and social logins",
        ).exists(),
      ).toBeTruthy();

      await click("Logins");
      waitFor(waitTime);
      expect(
        text("Your emails, phones and social logins").exists(),
      ).toBeTruthy();

      await click("taiko@2e2.test");
      waitFor(waitTime);
      expect(text("Primary").exists()).toBeTruthy();
    } catch (error) {
      await screenshot({
        path: "tests/e2e/screenshots/click_login_btn.png",
      });

      throw error;
    } finally {
      done();
    }
  });
});
