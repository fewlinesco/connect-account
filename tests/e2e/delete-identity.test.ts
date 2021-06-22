import {
  openBrowser,
  closeBrowser,
  text,
  click,
  screenshot,
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
      observe: true,
      observeTime: 500,
    });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("It should navigate to the show of the Identity, and delete it", async () => {
    expect.assertions(7);

    try {
      await authenticateToConnect();

      await click("LOGINS");

      await click("Show");

      await click(link("_delete_"));

      expect(await text("Delete this email address").exists()).toBeTruthy();
      await click(text("Delete this email address"));

      expect(await text("You are about to delete").exists()).toBeTruthy();
      await click("Delete this email address");

      expect(
        await text("Email address has been deleted").exists(),
      ).toBeTruthy();

      await click("Show");

      expect(await text("Hide").exists()).toBeTruthy();
      expect(await link("_delete_").exists()).toBeFalsy();
    } catch (error) {
      await screenshot({
        path: "./tests/e2e/screenshots/delete-identity.png",
      });

      throw error;
    }
  });
});
