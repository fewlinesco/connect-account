import { text, click, screenshot, write, press, goto, setConfig } from "taiko";

import { configVariables } from "@src/configs/config-variables";

async function authenticateToConnect(): Promise<void> {
  try {
    setConfig({ retryTimeout: 30000 });

    await goto(
      process.env.CONNECT_TEST_ACCOUNT_URL || configVariables.connectAccountURL,
    );

    await click("Access my account");

    const isAlreadyLoggedIn = await text("already logged in").exists(1000, 50);
    if (isAlreadyLoggedIn) {
      await click("Continue");
    } else {
      await write(configVariables.connectTestAccountEmail);
      await press("Enter");

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
