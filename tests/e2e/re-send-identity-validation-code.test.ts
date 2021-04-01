import {
  openBrowser,
  closeBrowser,
  text,
  click,
  screenshot,
  waitFor,
  link,
  textBox,
  focus,
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
    });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("It should re-send an Identity validation code", async (done) => {
    expect.assertions(9);

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

      expect(await text("Resend validation code").exists()).toBeTruthy();
      await click("Resend validation code");

      expect(
        await text("A confirmation email has been sent").exists(),
      ).toBeTruthy();

      const secondURL = await currentURL();
      expect(firstURL).not.toMatch(secondURL);

      done();
    } catch (error) {
      await screenshot({
        path: "tests/e2e/screenshots/re-send-identity-validation-code.png",
      });

      done(error);
    }
  });
});
