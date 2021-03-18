// @ts-nocheck
import lighthouse from "lighthouse";
import {
  openBrowser,
  closeBrowser,
  click,
  waitFor,
  write,
  press,
  goto,
  setConfig,
} from "taiko";

import { config } from "../src/config";

type Lighthouse = { lhr: { categories: { score: any }[] } };

async function runLighthouseReport(): Promise<void> {
  await openBrowser({
    args: [
      "--window-size=400,800",
      "--no-sandbox",
      "--start-maximized",
      "--disable-dev-shm",
    ],
    headless: true,
  });

  setConfig({ retryTimeout: 30000 });

  await goto(process.env.CONNECT_TEST_ACCOUNT_URL || config.connectAccountURL);

  await waitFor("Access my account");
  console.log("Homepage loaded.");
  await click("Access my account");

  await waitFor("Email");
  await write(config.connectTestAccountEmail);
  await press("Enter");

  await waitFor("Password");
  await write(config.connectTestAccountPassword);
  await press("Enter", { navigationTimeout: 60000 });
  console.log("Test user authenticated.");

  const { lhr } = (await lighthouse(
    process.env.CONNECT_TEST_ACCOUNT_URL || config.connectAccountURL,
    {
      port: process.env.CONNECT_ACCOUNT_PORT || 29703,
      hostname: "connect-account.local",
      output: "json",
      logLevel: "info",
    },
  )) as Lighthouse;

  console.log("===");
  console.log(Object.values(lhr.categories));
  console.log("===");

  console.log(
    `Lighthouse scores: ${Object.values(lhr.categories)
      .map(({ score }) => score)
      .join(", ")}`,
  );

  await closeBrowser();
}

runLighthouseReport();
