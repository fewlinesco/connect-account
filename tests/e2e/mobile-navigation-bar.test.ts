import {
  openBrowser,
  closeBrowser,
  text,
  click,
  screenshot,
  waitFor,
} from "taiko";

import { authenticateToConnect } from "./utils/authenticate-to-connect";

describe("Log in with a smart phone, open and close the navigation bar", () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    await openBrowser({ args: ["--window-size=400,800"], headless: true });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("Launch the browser with a smartphone, open and close the navigation bar", async (done) => {
    expect.assertions(7);

    try {
      await authenticateToConnect();

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
