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
    try {
      if (isStagingEnv) {
        printStep("Address create with wrong input values", true);
        await authenticateToConnect();
        expect.assertions(1);

        printStep("Navigate to form");
        await goto((await currentURL()) + "/profile/addresses/new/");

        printStep("Remove required attribute on inputs");
        for await (const label of ["Postal Code", "Locality", "Country"]) {
          await evaluate($("input", below(label)), (element) => {
            element.removeAttribute("required");
          });
        }

        printStep("Try to create the address");
        await click(localizedStrings.newAddress.add);

        printStep("Expecting errors displayed");
        expect(
          await text("Please fill in the above field.").elements(),
        ).toHaveLength(3);
      }
    } catch (error) {
      await screenshot({
        path: "./tests/e2e/screenshots/fill-incorrect-address-input-values.png",
      });
      throw error;
    }
  });
});
