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
  below,
  waitFor,
} from "taiko";

import { authenticateToConnect } from "./utils/authenticate-to-connect";

describe("Profile Happy path", () => {
  jest.setTimeout(80000);

  beforeAll(async () => {
    await openBrowser({
      args: [
        "--window-size=1440,1000",
        "--no-sandbox",
        "--start-maximized",
        "--disable-dev-shm",
      ],
      headless: false,
      observe: false,
      observeTime: 2000,
    });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("it should do Profile and Addresses flows happy path", async (done) => {
    expect.assertions(19);

    try {
      await authenticateToConnect();

      expect(await text("Personal Information").exists()).toBeTruthy();
      await click("Personal Information");

      // Update user profile flow
      expect(
        await link("Update your personal information").exists(),
      ).toBeTruthy();
      await click("Update your personal information");
      expect(await text("Profile | edit").exists()).toBeTruthy();

      await clear(textBox("Username"));
      await write(
        "Superman",
        into(textBox({ placeholder: "Enter your username" })),
      );

      await click("Update my information");
      expect(await text("Your profile has been updated").exists()).toBeTruthy();

      // Add address flow
      expect(await link("Add new address").exists()).toBeTruthy();
      await click(link("Add new address"));
      expect(await text("Address | new").exists()).toBeTruthy();

      await write(
        "Metropolis",
        into(textBox({ placeholder: "Enter your locality" })),
      );
      await write(
        "59000",
        into(textBox({ placeholder: "Enter your postal code" })),
      );
      await write(
        "United States of America",
        into(textBox({ placeholder: "Enter your country" })),
      );

      await click("Add address");
      expect(await text("Your address has been added").exists()).toBeTruthy();

      // Update address flow
      await click(link("Delivery", below("Addresses")));

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

      // Delete address flow
      await waitFor(500);

      await click("Delete this address");
      expect(
        await text("You are about to delete this address.").exists(),
      ).toBeTruthy();
      await click("Delete");
      expect(await text("Your address has been deleted").exists()).toBeTruthy();

      // Mark address as primary flow
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

      done();
    } catch (error) {
      done(error);
    }
  });
});
