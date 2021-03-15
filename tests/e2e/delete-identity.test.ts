import {
  openBrowser,
  closeBrowser,
  text,
  click,
  screenshot,
  waitFor,
  link,
} from "taiko";

import { authenticateToConnect } from "./utils/authenticate-to-connect";

describe("Delete Identity", () => {
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

  test("It should navigate to the show of the Identity, and delete it", async (done) => {
    expect.assertions(12);

    try {
      await authenticateToConnect();

      await waitFor("Logins");
      expect(await text("Logins").exists()).toBeTruthy();
      await click("Logins");

      await waitFor("Show");
      expect(await text("Show").exists()).toBeTruthy();
      await click("Show");

      await waitFor("_delete_");
      expect(await link("_delete_").exists()).toBeTruthy();
      await click(link("_delete_"));

      await waitFor("Delete this email address");
      expect(await text("Delete this email address").exists()).toBeTruthy();
      await click(text("Delete this email address"));

      await waitFor("You are about to delete");
      expect(await text("You are about to delete").exists()).toBeTruthy();
      expect(await text("Delete this email address").exists()).toBeTruthy();
      await click("Delete this email address");

      await waitFor("Show");
      expect(await text("Show").exists()).toBeTruthy();
      await click("Show");

      await waitFor("Hide");
      expect(await text("Hide").exists()).toBeTruthy();
      expect(!(await link("_delete_").exists(0, 0))).toBeTruthy();

      done();
    } catch (error) {
      await screenshot({
        path: "tests/e2e/screenshots/delete-identity.png",
      });

      done(error);
    }
  });
});
