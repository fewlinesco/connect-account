import {
  openBrowser,
  closeBrowser,
  text,
  click,
  screenshot,
  link,
  below,
  above,
} from "taiko";

import { authenticateToConnect } from "./utils/authenticate-to-connect";
import * as locales from "@content/locales";

describe("Mark Identity as primary", () => {
  jest.setTimeout(60000);

  const localizedErrorStrings = locales.en;

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

  test("It should correctly mark another identity to primary status and going back to logins overview page", async () => {
    expect.assertions(6);

    try {
      await authenticateToConnect();

      await click("LOGINS");

      await click("Show");

      expect(await text("Hide").exists()).toBeTruthy();

      const primaryIdentity = await link("", below("Email addresses")).text();

      const nonPrimaryYet = (
        await link("", below(primaryIdentity)).text()
      ).includes("_delete_")
        ? await link("", above("Hide")).text()
        : await link("", below(primaryIdentity)).text();

      await click(nonPrimaryYet);
      await click(
        localizedErrorStrings["/account/logins/[type]/[id]"].markEmail,
      );
      await click("Confirm");
      expect(
        await text(`${nonPrimaryYet} is now your primary email`).exists(),
      ).toBeTruthy();

      await click(link("", below("Email addresses")));

      expect(text(nonPrimaryYet)).toBeTruthy();
    } catch (error) {
      await screenshot({
        path: "./tests/e2e/screenshots/mark-identity-as-primary.test.png",
      });

      throw error;
    }
  });
});
