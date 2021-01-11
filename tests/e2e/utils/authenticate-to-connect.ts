import { text, click, screenshot, waitFor, write, press, goto } from "taiko";

import { config } from "@src/config";

export async function authenticateToConnect(): Promise<void> {
  try {
    await goto(
      process.env.CONNECT_ACCOUNT_TEST_URL || config.connectAccountURL,
    );

    await waitFor("Access my account");
    expect(await text("Access my account").exists()).toBeTruthy();
    await click("Access my account");

    await waitFor("Email");
    expect(await text("Email").exists()).toBeTruthy();
    await write(config.connectTestAccountEmail);
    await press("Enter");

    await waitFor("Password");
    expect(await text("Password").exists()).toBeTruthy();
    await write(config.connectTestAccountPassword);
    await press("Enter", { navigationTimeout: 60000 });
  } catch (error) {
    await screenshot({
      path: "tests/e2e/screenshots/authenticate-to-connect.png",
    });

    throw error;
  }
}
