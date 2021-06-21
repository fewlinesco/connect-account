import {
  openBrowser,
  closeBrowser,
  text,
  click,
  screenshot,
  link,
  textBox,
  write,
  currentURL,
  into,
  waitFor,
} from "taiko";

import { authenticateToConnect } from "./utils/authenticate-to-connect";

describe("Account Web Application re-send Identity validation code", () => {
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
      observeTime: 1000,
    });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("It should re-send an Identity validation code", async () => {
    expect.assertions(8);

    try {
      await authenticateToConnect();

      expect(await text("LOGINS").exists()).toBeTruthy();
      await click("LOGINS");

      expect(await text("+ Add new email address").exists()).toBeTruthy();
      await click(link("+ Add new email address"));

      expect(await text("Email address *").exists()).toBeTruthy();
      await write(
        "resend-validation-code@taiko.test",
        into(textBox({ placeholder: "Enter your email" })),
      );
      await click("Add email");

      const firstURL = await currentURL();

      await waitFor(3000);

      expect(await text("Resend validation code").exists()).toBeTruthy();
      await click("Resend validation code");

      const secondURL = await currentURL();
      expect(firstURL).not.toMatch(secondURL);
    } catch (error) {
      await screenshot({
        path: "tests/e2e/screenshots/re-send-identity-validation-code.png",
      });

      throw error;
    }
  });
});
