import {
  openBrowser,
  closeBrowser,
  text,
  click,
  screenshot,
  waitFor,
  link,
  below,
  above,
} from "taiko";

import { authenticateToConnect } from "./utils/authenticate-to-connect";

describe("Mark Identity as primary", () => {
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
    });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("It should correctly mark another identity to primary status and going back to logins overview page", async (done) => {
    expect.assertions(9);

    try {
      await authenticateToConnect();

      expect(await text("LOGINS").exists()).toBeTruthy();
      await click("LOGINS");

      expect(await text("Show").exists()).toBeTruthy();
      await click("Show");

      expect(await text("Hide").exists()).toBeTruthy();

      const nonPrimaryYet = await link(".test", above("Hide")).text();
      await click(nonPrimaryYet);

      expect(await text("Make").exists()).toBeTruthy();
      await click("Make");

      expect(await text("Confirm").exists()).toBeTruthy();
      await click("Confirm");

      expect(await link(".test", below("Email addresses")).text()).toEqual(
        nonPrimaryYet,
      );

      done();
    } catch (error) {
      await screenshot({
        path: "tests/e2e/screenshots/mark-identity-as-primary.test.png",
      });

      done(error);
    }
  });
});
