import { openBrowser, closeBrowser, text, click, screenshot } from "taiko";

import { authenticateToConnect } from "./utils/authenticate-to-connect";

describe("Log in with a smart phone, open and close the navigation bar", () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    await openBrowser({
      args: [
        "--window-size=400,800",
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

  test("Launch the browser with a smartphone, open and close the navigation bar", async () => {
    expect.assertions(3);

    try {
      await authenticateToConnect();

      const needCookieAcceptance = await text("Cookies").exists(10000, 50);

      if (needCookieAcceptance) {
        await click("Accept");
      }

      await click("Menu");
      expect(await text("Close").exists()).toBeTruthy();
      expect(await text("Home").exists()).toBeTruthy();

      await click("Close");
      expect(await text("Menu").exists()).toBeTruthy();
    } catch (error) {
      await screenshot({
        path: "./tests/e2e/screenshots/mobile_navigation_bar.png",
      });

      throw error;
    }
  });
});
