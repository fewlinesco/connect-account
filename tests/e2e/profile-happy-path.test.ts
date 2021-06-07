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
} from "taiko";

import { authenticateToConnect } from "./utils/authenticate-to-connect";

describe("Profile Happy path", () => {
  jest.setTimeout(60000);

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

  test("it should redirect", async (done) => {
    expect.assertions(13);

    try {
      await authenticateToConnect();

      expect(await text("Personal Information").exists()).toBeTruthy();
      await click("Personal Information");

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

      done();
    } catch (error) {
      done(error);
    }
  });
});
