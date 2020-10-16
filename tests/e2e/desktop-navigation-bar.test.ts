import {
  openBrowser,
  closeBrowser,
  goto,
  text,
  click,
  screenshot,
  waitFor,
  write,
  press,
} from "taiko";

import { config } from "@src/config";

describe("DesktopNavigationBar", () => {
  jest.setTimeout(20000);

  beforeAll(async () => {
    await openBrowser({ args: ["--window-size=1440,1000"], headless: true });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("Log in with a desktop computer, use the navbar to go to the logins page and go back to home page", async (done) => {
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

      await waitFor("Logins");
      expect(await text("Logins").exists()).toBeTruthy();

      await click("Logins");
      await waitFor("Email addresses");
      expect(await text("Email addresses").exists()).toBeTruthy();

      await click("Home");
      await waitFor("LOGINS");
      expect(await text("LOGINS").exists()).toBeTruthy();

      done();
    } catch (error) {
      await screenshot({
        path: "tests/e2e/screenshots/desktop_navigation_bar.png",
      });

      done(error);
    }
  });
});
