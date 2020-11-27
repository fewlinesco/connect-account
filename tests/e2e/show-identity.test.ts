import {
  openBrowser,
  closeBrowser,
  goto,
  text,
  click,
  screenshot,
  waitFor,
  link,
  below,
} from "taiko";

import { authToConnect } from "./utils/authToConnect";

describe("Account Web Application show identity", () => {
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

  test("Launch the browser and go to the primary email identity show", async (done) => {
    expect.assertions(6);

    if (process.env.CONNECT_ACCOUNT_TEST_URL === undefined) {
      throw new Error(
        "CONNECT_ACCOUNT_TEST_URL environment variable is undefined",
      );
    }

    try {
      await goto(process.env.CONNECT_ACCOUNT_TEST_URL);

      await authToConnect();

      await waitFor("LOGINS");
      expect(await text("LOGINS").exists()).toBeTruthy();

      await click("LOGINS");
      await waitFor("Email addresses");
      expect(await text("Email addresses").exists()).toBeTruthy();

      await click(link(".test", below("Email addresses")));
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
