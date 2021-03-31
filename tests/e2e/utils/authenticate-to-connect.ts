import {
  text,
  click,
  screenshot,
  waitFor,
  write,
  press,
  goto,
  setConfig,
} from "taiko";

import { configVariables } from "@src/configs/config-variables";

async function authenticateToConnect(): Promise<void> {
  try {
    setConfig({ retryTimeout: 30000 });

    await goto(
      process.env.CONNECT_TEST_ACCOUNT_URL || configVariables.connectAccountURL,
    );

    await waitFor("Access my account");
    expect(await text("Access my account").exists()).toBeTruthy();
    await click("Access my account");

    await waitFor("Email");
    expect(await text("Email").exists()).toBeTruthy();
    await write(configVariables.connectTestAccountEmail);
    await press("Enter");

    await waitFor("Password");
    expect(await text("Password").exists()).toBeTruthy();
    await write(configVariables.connectTestAccountPassword);
    await press("Enter", { navigationTimeout: 60000 });
  } catch (error) {
    await screenshot({
      path: "tests/e2e/screenshots/authenticate-to-connect.png",
    });

    throw error;
  }
}

export { authenticateToConnect };
