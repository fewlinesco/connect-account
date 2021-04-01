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

  test("Log in with a desktop computer, use the navbar to go to the logins page and go back to home page", async (done) => {
    expect.assertions(6);

    try {
      await authenticateToConnect();

      expect(await text("Logins").exists()).toBeTruthy();

      await click("Logins");
      expect(await text("Email addresses").exists()).toBeTruthy();

      await click("Home");
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
