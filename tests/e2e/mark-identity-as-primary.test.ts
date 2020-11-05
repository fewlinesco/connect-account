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
  focus,
  textBox,
  clear,
  link,
  below,
  above,
} from "taiko";

import { config } from "@src/config";

describe("Marking another identity as the primary one on connect account", () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    await openBrowser({ args: ["--window-size=1440,1000"], headless: false });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("should correctly mark another identity to primary status and going back to logins overview page", async (done) => {
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
      await waitFor("Show");
      expect(await text("Show").exists()).toBeTruthy();
      await click("Show");

      await click(link(".test", above("Hide")));

      done();
    } catch (error) {
      done(error);
    }
  });
});
