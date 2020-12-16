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

import { authenticateToConnect } from "./utils/authenticateToConnect";

describe("Marking another identity as the primary one on connect account", () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    await openBrowser({ args: ["--window-size=1440,1000"], headless: true });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("should correctly mark another identity to primary status and going back to logins overview page", async (done) => {
    expect.assertions(9);

    try {
      await authenticateToConnect();

      await waitFor("LOGINS");
      expect(await text("LOGINS").exists()).toBeTruthy();
      await click("LOGINS");

      await waitFor("Show");
      expect(await text("Show").exists()).toBeTruthy();
      await click("Show");

      await waitFor("Hide");
      expect(await text("Hide").exists()).toBeTruthy();
      const nonPrimaryYet = await link(".test", above("Hide")).text();
      await click(nonPrimaryYet);

      await waitFor("Make");
      expect(await text("Make").exists()).toBeTruthy();
      await click("Make");

      await waitFor("Confirm");
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
