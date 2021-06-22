import {
  closeBrowser,
  openBrowser,
  text,
  click,
  textBox,
  into,
  write,
  clear,
  link,
  screenshot,
  waitFor,
  currentURL,
  below,
} from "taiko";

import { authenticateToConnect } from "./utils/authenticate-to-connect";
import { configVariables } from "@src/configs/config-variables";

describe.only("Profile Happy path", () => {
  jest.setTimeout(240000);

  beforeAll(async () => {
    await openBrowser({
      args: [
        "--window-size=1440,1000",
        "--no-sandbox",
        "--start-maximized",
        "--disable-dev-shm",
      ],
      headless: true,
      observe: true,
      observeTime: 2000,
    });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  const isStagingEnv = (
    process.env.CONNECT_PROFILE_URL || configVariables.connectProfileUrl
  ).includes("staging");

  test("it should do Profile and Addresses flows' happy path", async () => {
    expect.assertions(isStagingEnv ? 32 : 20);

    try {
      await authenticateToConnect();

      const baseURL = (
        process.env.CONNECT_TEST_ACCOUNT_URL ||
        configVariables.connectAccountURL
      ).replace(/\/?$/, "");

      console.log("isStagingEnv: ", isStagingEnv);
      console.log("PROFILE URL: ", process.env.CONNECT_PROFILE_URL);
      console.log("USERSUB: ", process.env.CONNECT_TEST_ACCOUNT_SUB);
      console.log("targetUrl:", process.env.CONNECT_TEST_ACCOUNT_URL);

      if (isStagingEnv) {
        expect(await text("Create your profile").exists()).toBeTruthy();
        await click("Create your profile");
        expect(await text("Profile | new").exists()).toBeTruthy();
        await write(
          "Taiko Test",
          into(textBox({ placeholder: "Enter your full name" })),
        );
        await click("Add my information");
        await waitFor(1000);
        expect(
          await text("Your profile has been created").exists(),
        ).toBeTruthy();
        expect(await currentURL()).toEqual(`${baseURL}/account/profile`);
        console.log("PROFILE CREATION DONE");
      } else {
        expect(await text("Personal Information").exists()).toBeTruthy();
        await click("Personal Information");
      }
      await waitFor(1000);

      // Update user profile flow
      expect(
        await text("Update your personal information").exists(),
      ).toBeTruthy();
      await click("Update your personal information");
      expect(await text("Profile | edit").exists()).toBeTruthy();

      await clear(textBox("Username"));
      await write(
        "Supertest",
        into(textBox({ placeholder: "Enter your username" })),
      );
      expect(await textBox({ value: "Supertest" }).exists()).toBeTruthy();
      await click("Update my information");

      await waitFor(2000);
      expect(await text("Basic information").exists()).toBeTruthy();
      expect(
        await text("Supertest", below("PREFERRED USERNAME")).exists(),
      ).toBeTruthy();
      expect(await currentURL()).toEqual(`${baseURL}/account/profile`);

      // Add address flow
      expect(await text("Add new address").exists()).toBeTruthy();
      await click(text("Add new address"));
      expect(await text("Address | new").exists()).toBeTruthy();

      await write(
        "42 Test Road",
        into(textBox({ placeholder: "Enter your street address" })),
      );
      await write(
        "Test City",
        into(textBox({ placeholder: "Enter your locality" })),
      );
      await write(
        "42420",
        into(textBox({ placeholder: "Enter your postal code" })),
      );
      await write(
        "Testland",
        into(textBox({ placeholder: "Enter your country" })),
      );
      await write(
        "Home",
        into(textBox({ placeholder: "Enter your address kind" })),
      );

      await click("Add address");
      await waitFor(1000);
      expect(await currentURL()).toEqual(`${baseURL}/account/profile`);

      if (isStagingEnv) {
        expect(await text("Add new address").exists()).toBeTruthy();
        await click(text("Add new address"));
        await waitFor(1000);
        expect(await text("Address | new").exists()).toBeTruthy();

        await write(
          "23 Test Road",
          into(textBox({ placeholder: "Enter your street address" })),
        );
        await write(
          "Test City",
          into(textBox({ placeholder: "Enter your locality" })),
        );
        await write(
          "42420",
          into(textBox({ placeholder: "Enter your postal code" })),
        );
        await write(
          "Testland",
          into(textBox({ placeholder: "Enter your country" })),
        );
        await write(
          "Work",
          into(textBox({ placeholder: "Enter your address kind" })),
        );

        await click("Add address");
        await waitFor(1000);
        expect(await currentURL()).toEqual(`${baseURL}/account/profile`);
      }

      // Update address flow
      await click(link("", below("Addresses")));

      expect(await text("Primary").exists()).toBeTruthy();
      await click("Update this address");
      expect(await text("Address | edit").exists()).toBeTruthy();

      await clear(textBox("Street address"));
      await write(
        "21b Baker Street",
        into(textBox({ placeholder: "Enter your street address" })),
      );

      await click("Update my address");
      expect(await text("Your address has been updated").exists()).toBeTruthy();

      // Mark address as primary flow
      await click("Personal Information");
      await waitFor(1000);
      expect(await text("Show 1 more").exists()).toBeTruthy();
      await click("Show 1 more");
      await click(link("Work"));

      expect(
        await text("Use this address as my main address").exists(),
      ).toBeTruthy();
      await click("Use this address as my main address");
      expect(
        await text("You are about to set this address as main.").exists(),
      ).toBeTruthy();
      await click("Confirm");
      expect(
        await text("Your address has been marked as primary").exists(),
      ).toBeTruthy();

      // Delete address flow
      await click(link("", below("Addresses")));
      expect(await text("Primary").exists()).toBeTruthy();

      await click("Delete this address");
      expect(
        await text("You are about to delete this address.").exists(),
      ).toBeTruthy();
      await click("Delete");
      await waitFor(1000);
      expect(await currentURL()).toEqual(`${baseURL}/account/profile`);

      if (isStagingEnv) {
        await click(link("", below("Addresses")));
        expect(await text("Primary").exists()).toBeTruthy();

        await click("Delete this address");
        expect(
          await text("You are about to delete this address.").exists(),
        ).toBeTruthy();
        await click("Delete");
        await waitFor(1000);
        expect(await currentURL()).toEqual(`${baseURL}/account/profile`);
      }
    } catch (error) {
      await screenshot({
        path: "tests/e2e/screenshots/profile-happy-path.png",
      });
      throw error;
    }
  });
});
