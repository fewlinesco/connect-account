import { openBrowser, closeBrowser, text, click, screenshot } from "taiko";

import { authenticateToConnect } from "./utils/authenticate-to-connect";

describe("DesktopNavigationBar", () => {
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
      observe: false,
      observeTime: 2000,
    });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("Log in with a desktop computer, use the navbar to go to the logins page and go back to home page", async () => {
    expect.assertions(2);

    try {
      await authenticateToConnect();

      await click("LOGINS");
      expect(await text("Email addresses").exists()).toBeTruthy();

      await click("Home");
      expect(await text("LOGINS").exists()).toBeTruthy();
    } catch (error) {
      await screenshot({
        path: "./tests/e2e/screenshots/desktop_navigation_bar.png",
      });

      throw error;
    }
  });
});
