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
    expect.assertions(5);

    try {
      await authenticateToConnect();

      await click("LOGINS");

      await click(link("+ Add new email address"));

      expect(await text("Email address *").exists()).toBeTruthy();
      await write(
        "resend-validation-code@taiko.test",
        into(textBox({ placeholder: "Enter your email" })),
      );
      await click("Add email");

      const firstURL = await currentURL();

      await click("Resend validation code");

      const secondURL = await currentURL();
      expect(firstURL).not.toMatch(secondURL);
    } catch (error) {
      await screenshot({
        path: "./tests/e2e/screenshots/re-send-identity-validation-code.png",
      });

      throw error;
    }
  });
});
