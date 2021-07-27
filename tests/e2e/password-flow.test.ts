import fetch from "cross-fetch";
import {
  openBrowser,
  closeBrowser,
  text,
  click,
  write,
  screenshot,
  focus,
  textBox,
  clear,
  waitFor,
} from "taiko";

import { authenticateToConnect } from "./utils/authenticate-to-connect";
import * as locales from "@content/locales";

async function checkVerificationCode(): Promise<void> {
  const shouldDoCodeVerification = await text("send validation code").exists();
  if (shouldDoCodeVerification) {
    await waitFor(2000);
    await click("Send validation code");
    await waitFor(1000);
    const response = await fetch(
      "https://mocks.prod.connect.connect.aws.eu-west-2.k8s.fewlines.net/mail/email",
    );
    const emails = (await response.json()) as unknown as {
      headers: { to: string };
      id: string;
      text: string;
      time: number;
    }[];
    const email = emails
      .sort((a, b) => (a.time < b.time ? 1 : -1))
      .find(
        (email) => email.headers.to === process.env.CONNECT_TEST_ACCOUNT_EMAIL,
      );
    if (email) {
      const match = email.text.match(/code (\d{6}) /);
      if (match) {
        const code = match[1];
        fetch(
          `https://mocks.prod.connect.connect.aws.eu-west-2.k8s.fewlines.net/mail/email/${email.id}`,
          { method: "DELETE" },
        );
        await write(code);
        await click("confirm");
      }
    }
  }
}

describe("Account Web Application update password", () => {
  jest.setTimeout(90000);

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

  const localizedErrorStrings = locales.en.errors;
  const localizedStrings = {
    accountOverview: locales.en["/account"],
    security: locales.en["/account/security"],
    passwordForm: locales.en["/account/security/update"],
  };

  test("It should show error messages if password inputs are filled incorrectly", async () => {
    expect.assertions(9);

    try {
      await authenticateToConnect();

      expect(
        await text(localizedStrings.accountOverview.securityTitle).exists(),
      ).toBeTruthy();
      await click(localizedStrings.accountOverview.securityTitle);

      expect(
        await text(localizedStrings.security.updatePassword).exists(),
      ).toBeTruthy();
      await click(localizedStrings.security.updatePassword);

      await checkVerificationCode();
      expect(
        await text(localizedStrings.passwordForm.newPasswordLabel).exists(),
      ).toBeTruthy();

      await focus(textBox(localizedStrings.passwordForm.newPasswordLabel));
      await write("q");

      await focus(
        textBox(localizedStrings.passwordForm.confirmNewPasswordLabel),
      );
      await write("qq");

      await click(localizedStrings.passwordForm.update);
      expect(
        await text(localizedErrorStrings.passwordMatch).exists(),
      ).toBeTruthy();

      await focus(textBox(localizedStrings.passwordForm.newPasswordLabel));
      await clear(textBox(localizedStrings.passwordForm.newPasswordLabel));
      await write("q");

      await focus(
        textBox(localizedStrings.passwordForm.confirmNewPasswordLabel),
      );
      await clear(
        textBox(localizedStrings.passwordForm.confirmNewPasswordLabel),
      );
      await write("q");

      await click(localizedStrings.passwordForm.update);

      expect(
        await text(localizedErrorStrings.passwordCriteria).exists(),
      ).toBeTruthy();
      expect(await text("1 digit").exists()).toBeTruthy();
      expect(await text("1 non-digit").exists()).toBeTruthy();
      expect(await text("8 characters").exists()).toBeTruthy();

      await focus(textBox(localizedStrings.passwordForm.newPasswordLabel));
      await clear(textBox(localizedStrings.passwordForm.newPasswordLabel));
      await write("");
      await focus(
        textBox(localizedStrings.passwordForm.confirmNewPasswordLabel),
      );
      await clear(
        textBox(localizedStrings.passwordForm.confirmNewPasswordLabel),
      );
      await write("");
      await click(localizedStrings.passwordForm.update);
      expect(
        await text(localizedErrorStrings.blankPassword).exists(),
      ).toBeTruthy();
    } catch (error) {
      await screenshot({
        path: "./tests/e2e/screenshots/password-flow.test.png",
      });

      throw error;
    }
  });
});
