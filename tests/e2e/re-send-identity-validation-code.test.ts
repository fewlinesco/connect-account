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
import * as locales from "@content/locales";

describe("Account Web Application re-send Identity validation code", () => {
  jest.setTimeout(60000);

  const localizedStrings = {
    overview: locales.en["/account/logins/"],
    new: locales.en["/account/logins/[type]/new/"],
  };

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
    expect.assertions(2);

    try {
      await authenticateToConnect();

      await click("LOGINS");
      await click(link(localizedStrings.overview.emailAddNewIdentityMessage));
      expect(
        await text(localizedStrings.new.emailInputLabel).exists(),
      ).toBeTruthy();

      await write(
        "resend-validation-code@taiko.test",
        into(textBox({ placeholder: localizedStrings.new.emailPlaceholder })),
      );
      await click(localizedStrings.new.addEmail);

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
