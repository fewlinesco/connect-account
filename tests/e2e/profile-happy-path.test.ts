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

  const isStagingEnv = (process.env.CONNECT_PROFILE_URL || "").includes(
    "staging",
  );

  test("it should do Profile flows happy path", async (done) => {
    expect.assertions(isStagingEnv ? 10 : 7);

    try {
      await authenticateToConnect();

      if (isStagingEnv) {
        expect(await text("Create your profile").exists()).toBeTruthy();
        await click("Create your profile");

        expect(await text("Profile | new").exists()).toBeTruthy();

        await write(
          "Superman",
          into(textBox({ placeholder: "Enter your name" })),
        );

        await click("Add my information");
        expect(
          await text("Your profile has been created").exists(),
        ).toBeTruthy();
      } else {
        expect(await text("Personal Information").exists()).toBeTruthy();
        await click("Personal Information");
      }

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

      done();
    } catch (error) {
      await screenshot({
        path: "tests/e2e/screenshots/profile-happy-path.png",
      });
      done(error);
    }
  });
});
