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
    expect.assertions(10);

    try {
      await authenticateToConnect();

      expect(await text("Personal Information").exists()).toBeTruthy();
      await click("Personal Information");

      expect(
        await text("Update your personal information").exists(),
      ).toBeTruthy();
      await click("Update your personal information");

      expect(await text("Username").exists()).toBeTruthy();

      await clear(textBox({ value: "Clark" }));
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

      done();
    } catch (error) {
      done(error);
    }
  });
});
