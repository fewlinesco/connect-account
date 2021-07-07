import { text, click, screenshot, write, press, goto, setConfig } from "taiko";

import { configVariables } from "@src/configs/config-variables";

async function authenticateToConnect(): Promise<void> {
  try {
    setConfig({ retryTimeout: 30000 });

    await goto(
      process.env.CONNECT_TEST_ACCOUNT_URL || configVariables.connectAccountURL,
    );

    expect(await text("Access my account").exists()).toBeTruthy();
    await click("Access my account");

    const isAlreadyLoggedIn = await text("already logged in").exists(1000, 50);
    if (isAlreadyLoggedIn) {
      await click("Continue");
    } else {
      expect(await text("Email").exists()).toBeTruthy();
      await write(configVariables.connectTestAccountEmail);
      await press("Enter");

      expect(await text("Password").exists()).toBeTruthy();
      await write(configVariables.connectTestAccountPassword);
      await press("Enter", { navigationTimeout: 60000 });

      const needScopeAcceptance = await text(
        "would like to have access to these information about you",
      ).exists(10000, 50);

      if (needScopeAcceptance) {
        await click("Accept");
      }
    }
  } catch (error) {
    await screenshot({
      path: "tests/e2e/screenshots/authenticate-to-connect.png",
    });

    throw error;
  }
}

export { authenticateToConnect };
