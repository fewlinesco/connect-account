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

describe("Log in with a smart phone, open and close the navigation bar", () => {
  jest.setTimeout(20000);

  beforeAll(async () => {
    await openBrowser({ args: ["--window-size=400,800"], headless: true });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("Launch the browser with a smartphone, open and close the navigation bar", async (done) => {
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
