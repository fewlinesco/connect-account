import { text, click, screenshot, waitFor, write, press } from "taiko";

import { config } from "@src/config";

export async function authToConnect(): Promise<void> {
  try {
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
    await press("Enter");
  } catch (error) {
    await screenshot({
      path: "tests/e2e/screenshots/auth-to-connect.png",
    });

    throw error;
  }
}
