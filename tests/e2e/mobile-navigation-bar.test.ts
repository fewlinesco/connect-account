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

describe("Log in with a smart phone, open and close the navigation bar", () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    await openBrowser({
      args: [
        "--window-size=1440,1000",
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
      headless: true,
    });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("Launch the browser with a smartphone, open and close the navigation bar", async (done) => {
    expect.assertions(7);

    if (process.env.CONNECT_ACCOUNT_TEST_URL === undefined) {
      throw new Error(
        "CONNECT_ACCOUNT_TEST_URL environment variable is undefined",
      );
    }

    try {
      await goto(process.env.CONNECT_ACCOUNT_TEST_URL);

      await authToConnect();

      await waitFor("Menu");
      expect(await text("Menu").exists()).toBeTruthy();

      await click("Menu");
      await waitFor("Close");
      expect(await text("Close").exists()).toBeTruthy();
      expect(await text("Home").exists()).toBeTruthy();

      await click("Close");
      await waitFor("Menu");
      expect(await text("Menu").exists()).toBeTruthy();

      done();
    } catch (error) {
      await screenshot({
        path: "tests/e2e/screenshots/mobile_navigation_bar.png",
      });

      done(error);
    }
  });
});
