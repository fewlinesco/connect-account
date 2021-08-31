import {
  closeBrowser,
  openBrowser,
  text,
  click,
  screenshot,
  $,
  evaluate,
  goto,
  currentURL,
  below,
} from "taiko";

import { authenticateToConnect, printStep } from "./utils";
import * as locales from "@content/locales";
import { CONFIG_VARIABLES } from "@src/configs/config-variables";

describe("Profile happy path", () => {
  jest.setTimeout(60000);

  const isStagingEnv = (
    process.env.CONNECT_PROFILE_URL || CONFIG_VARIABLES.connectProfileUrl
  ).includes("staging");

  const localizedStrings = {
    newAddress: locales.en["/account/profile/addresses/new"],
    errors: locales.en["errors"],
  };

  beforeAll(async () => {
    if (isStagingEnv) {
      await openBrowser({
        args: [
          "--window-size=1440,1000",
          "--no-sandbox",
          "--start-maximized",
          "--disable-dev-shm",
        ],
        headless: false,
        observe: true,
        observeTime: 1000,
      });
    }
  });

  afterAll(async () => {
    if (isStagingEnv) {
      await closeBrowser();
    }
  });

  test("it should display errors coming from Profile when required is disabled in address form", async () => {
    printStep("Address create with wrong input values", true);
    if (isStagingEnv) {
      try {
        await authenticateToConnect();
        expect.assertions(1);

        printStep("Navigate to form");
        await goto((await currentURL()) + "/profile/addresses/new/");

        printStep("Remove required attribute on inputs");
        for await (const label of [
          localizedStrings.newAddress.localityLabel,
          localizedStrings.newAddress.postalCodeLabel,
          localizedStrings.newAddress.countryLabel,
        ]) {
          await evaluate($("input", below(label)), (element) => {
            element.removeAttribute("required");
          });
        }

        printStep("Try to create the address");
        await click(localizedStrings.newAddress.add);

        printStep("Expecting errors displayed");
        expect(
          await text(
            localizedStrings.errors.invalidUserAddressPayload,
          ).elements(),
        ).toHaveLength(3);
      } catch (error) {
        await screenshot({
          path: "./tests/e2e/screenshots/fill-incorrect-address-input-values.png",
        });
        throw error;
      }
    } else {
      printStep("Test auto success because the env is not staging.");
    }
  });
});
