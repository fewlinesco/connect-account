import { text, click, screenshot, write, press, goto, setConfig } from "taiko";

import { printStep } from "./index";
import { CONFIG_VARIABLES } from "@src/configs/config-variables";

async function authenticateToConnect(): Promise<void> {
  try {
    printStep("🔒 Begin authentication");
    setConfig({ retryTimeout: 30000 });

    await goto(
      process.env.CONNECT_TEST_ACCOUNT_URL ||
        CONFIG_VARIABLES.connectAccountURL,
      { navigationTimeout: 60000 },
    );

    const needCookieAcceptance = await text("Cookies").exists(10000, 50);

    if (needCookieAcceptance) {
      await click("Accept all");
    }

    await click("Access my account");

    const isAlreadyLoggedIn = await text("already logged in").exists(1000, 50);
    if (isAlreadyLoggedIn) {
      printStep("🔒 Already logged in");
      await click("Continue");
    } else {
      printStep("🔒 Logging in");
      await write(CONFIG_VARIABLES.connectTestAccountEmail);
      await press("Enter");

      await write(CONFIG_VARIABLES.connectTestAccountPassword);
      await press("Enter", { navigationTimeout: 60000 });

      const needScopeAcceptance = await text(
        "would like to have access to these information about you",
      ).exists(10000, 50);

      if (needScopeAcceptance) {
        await click("Accept");
      }
      printStep("🔓🔑 Authenticated");
    }
  } catch (error) {
    await screenshot({
      path: "tests/e2e/screenshots/authenticate-to-connect.png",
    });

    throw error;
  }
}

export { authenticateToConnect };
