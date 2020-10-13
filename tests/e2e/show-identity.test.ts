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

describe("Account Web Application show identity", () => {
  jest.setTimeout(20000);

  beforeAll(async () => {
    await openBrowser({ args: ["--window-size=1440,1000"], headless: true });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("Launch the browser and go to the primary email identity show", async (done) => {
    expect.assertions(6);

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
      await waitFor("LOGINS");
      expect(await text("LOGINS").exists()).toBeTruthy();

      await click("LOGINS");
      await waitFor("Email addresses");
      expect(await text("Email addresses").exists()).toBeTruthy();

      await click(config.connectTestAccountEmail);
      await waitFor("Primary");
      expect(await text("Primary").exists()).toBeTruthy();

      done();
    } catch (error) {
      await screenshot({
        path: "tests/e2e/screenshots/show_identity.png",
      });

      done(error);
    }
  });
});
