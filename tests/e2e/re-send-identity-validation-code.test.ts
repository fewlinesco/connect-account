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
  jest.setTimeout(30000);

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

      await waitFor("LOGINS");
      expect(await text("LOGINS").exists()).toBeTruthy();

      await click("LOGINS");
      await waitFor("+ Add new email address");
      expect(await text("+ Add new email address").exists()).toBeTruthy();
      await click(link("+ Add new email address"));

      await waitFor("Email address *");
      expect(await text("Email address *").exists()).toBeTruthy();
      await focus(textBox({ placeholder: "Enter your email" }));
      await write("resend-validation-code@taiko.test");
      await click("Add email");

      const firstURL = await currentURL();

      await waitFor("Resend validation code");
      expect(await text("Resend validation code").exists()).toBeTruthy();
      await click("Resend validation code");

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
