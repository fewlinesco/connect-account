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
} from "taiko";

import { authenticateToConnect } from "./utils/authenticate-to-connect";

describe("Account Web Application re-send Identity validation code", () => {
  jest.setTimeout(120000);

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

  test("Re-send Identity validation code", async (done) => {
    expect.assertions(9);

    try {
      await authenticateToConnect();

      await waitFor("LOGINS");
      expect(await text("LOGINS").exists()).toBeTruthy();

      await click("LOGINS");
      await waitFor("+ add new email address");
      expect(await text("+ add new email address").exists()).toBeTruthy();
      await click(link("+ add new email address"));

      await waitFor("email address *");
      expect(await text("email address *").exists()).toBeTruthy();
      await focus(textBox({ placeholder: "Enter your email" }));
      await write("resend-validation-code@taiko.test");
      await click("Add email");

      const firstURL = await currentURL();

      await waitFor("Resend confirmation code");
      expect(await text("Resend confirmation code").exists()).toBeTruthy();
      await click("Resend confirmation code");

      await waitFor("A new confirmation email has been sent");
      expect(
        await text("A new confirmation email has been sent").exists(),
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
