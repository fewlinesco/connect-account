import {
  openBrowser,
  closeBrowser,
  goto,
  text,
  click,
  screenshot,
  waitFor,
} from "taiko";

import { authToConnect } from "./utils/authToConnect";

describe("DesktopNavigationBar", () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    await openBrowser({ args: ["--window-size=1440,1000"], headless: true });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("Log in with a desktop computer, use the navbar to go to the logins page and go back to home page", async (done) => {
    expect.assertions(6);

    try {
      await goto("http://localhost:29703");

      await authToConnect();

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
