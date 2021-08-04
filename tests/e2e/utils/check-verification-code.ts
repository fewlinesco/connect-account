import fetch from "cross-fetch";
import { text, waitFor, click, write } from "taiko";

import * as locales from "@content/locales";

const localizedStrings = {
  sudo: locales.en["/account/security/sudo/"],
};

async function checkVerificationCode(): Promise<void> {
  const shouldDoCodeVerification = await text(
    localizedStrings.sudo.send,
  ).exists();
  if (shouldDoCodeVerification) {
    await waitFor(2000);
    await click(localizedStrings.sudo.send);
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
        await click(localizedStrings.sudo.confirm);
      }
    }
  }
}

export { checkVerificationCode };
