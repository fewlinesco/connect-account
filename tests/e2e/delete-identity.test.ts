import {
  openBrowser,
  closeBrowser,
  text,
  click,
  screenshot,
  link,
  waitFor,
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
      observe: false,
      observeTime: 2000,
    });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("It should navigate to the show of the Identity, and delete it", async (done) => {
    expect.assertions(13);

    try {
      await authenticateToConnect();

      expect(await text("Logins").exists()).toBeTruthy();
      await click("Logins");

      expect(await text("Show").exists()).toBeTruthy();
      await click("Show");

      expect(await link("_delete_").exists()).toBeTruthy();
      await click(link("_delete_"));

      expect(await text("Delete this email address").exists()).toBeTruthy();
      await click(text("Delete this email address"));

      // Waiting to remove SWR cache.
      await waitFor(2000);

      expect(await text("You are about to delete").exists()).toBeTruthy();
      expect(await text("Delete this email address").exists()).toBeTruthy();
      await click("Delete this email address");

      expect(
        await text("Email address has been deleted").exists(),
      ).toBeTruthy();

      // Waiting to remove SWR cache.
      await waitFor(2000);

      expect(await text("Show").exists()).toBeTruthy();
      await click("Show");

      expect(await text("Hide").exists()).toBeTruthy();

      expect(!(await link("_delete_").exists())).toBeTruthy();
    } catch (error) {
      await screenshot({
        path: "tests/e2e/screenshots/delete-identity.png",
      });

      done(error);
    }
  });
});
