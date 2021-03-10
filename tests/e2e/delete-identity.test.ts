import {
  openBrowser,
  closeBrowser,
  text,
  click,
  screenshot,
  waitFor,
  link,
  evaluate,
} from "taiko";

import { authenticateToConnect } from "./utils/authenticate-to-connect";

describe("Delete Identity", () => {
  jest.setTimeout(30000);

  beforeAll(async () => {
    await openBrowser({
      args: [
        "--window-size=1440,1000",
        "--no-sandbox",
        "--start-maximized",
        "--disable-dev-shm",
      ],
      headless: false,
    });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("It should navigate to the show of the Identity, and delete it", async (done) => {
    expect.assertions(9);

    try {
      await authenticateToConnect();

      await waitFor("Logins");
      expect(await text("Logins").exists()).toBeTruthy();
      await click("Logins");

      await waitFor("Show");
      expect(await text("Show").exists()).toBeTruthy();
      await click("Show");

      await waitFor("_delete_");
      expect(await text("_delete_").exists()).toBeTruthy();
      await click(link("_delete_"));

      await waitFor("Delete this email address");
      expect(await text("Delete this email address").exists()).toBeTruthy();
      await click(text("Delete this email address"));

      await waitFor("You are about to");
      expect(await text("You are about to").exists()).toBeTruthy();
      await click(text("Delete this email address"));

      await waitFor("Show");
      expect(await text("Show").exists()).toBeTruthy();
      await click("Show");
      // expect(
      //   await evaluate(text("_delete_"), (element) => element === undefined),
      // ).toBe(true);

      waitFor(async () => !(await text("_delete_").exists()));

      done();
    } catch (error) {
      await screenshot({
        path: "tests/e2e/screenshots/delete-identity.png",
      });

      done(error);
    }
  });
});
