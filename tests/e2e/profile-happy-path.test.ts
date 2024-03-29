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
  below,
  currentURL,
  waitFor,
} from "taiko";

import { authenticateToConnect, printStep } from "./utils";
import * as locales from "@content/locales";
import { CONFIG_VARIABLES } from "@src/configs/config-variables";

describe("Profile happy path", () => {
  jest.setTimeout(130000);

  const isStagingEnv = (
    process.env.CONNECT_PROFILE_URL || CONFIG_VARIABLES.connectProfileUrl
  ).includes("staging");

  const baseURL = (
    process.env.CONNECT_TEST_ACCOUNT_URL || CONFIG_VARIABLES.connectAccountURL
  ).replace(/\/?$/, "");

  const profileUrl = `${baseURL}/account/profile/`;

  const localizedStrings = {
    navigation: locales.en.navigation,
    profileOverview: locales.en["/account/profile"],
    newProfile: locales.en["/account/profile/user-profile/new"],
    editProfile: locales.en["/account/profile/user-profile/edit"],
    addressOverview: locales.en["/account/profile/addresses/[id]"],
    newAddress: locales.en["/account/profile/addresses/new"],
    editAddress: locales.en["/account/profile/addresses/[id]/edit"],
  };

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
      observeTime: 1000,
    });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("it should do Profile flows' happy path", async () => {
    expect.assertions(isStagingEnv ? 21 : 14);

    printStep("Profile happy path", true);

    await authenticateToConnect();

    try {
      if (isStagingEnv) {
        printStep("Profile create");
        await click(localizedStrings.navigation.personalInformation);
        expect(
          await text(localizedStrings.newProfile.breadcrumb).exists(),
        ).toBeTruthy();

        await waitFor(1000);
        await write(
          "Taiko Test",
          into(
            textBox({
              placeholder: localizedStrings.newProfile.namePlaceholder,
            }),
          ),
        );

        await click(localizedStrings.newProfile.add);
      } else {
        await waitFor(
          async () =>
            await text(
              localizedStrings.navigation.personalInformation,
            ).exists(),
        );
        await waitFor(1000);
        await click(localizedStrings.navigation.personalInformation);
      }

      printStep("Profile update");
      await waitFor(
        async () =>
          await text(localizedStrings.profileOverview.updateInfo).exists(),
      );

      await click(localizedStrings.profileOverview.updateInfo);

      await text(localizedStrings.editProfile.breadcrumb).exists();

      await waitFor(3000);
      await clear(textBox(localizedStrings.editProfile.usernameLabel));

      await write(
        "Supertest",
        into(
          textBox({
            placeholder: localizedStrings.editProfile.usernamePlaceholder,
          }),
        ),
      );
      expect(await textBox({ value: "Supertest" }).exists()).toBeTruthy();

      await click(localizedStrings.editProfile.update);
      expect(await currentURL()).toEqual(`${baseURL}/account/profile/`);

      printStep("Address create");

      await waitFor(2000);
      await click(text(localizedStrings.profileOverview.addAddress));
      await waitFor(2000);

      expect(
        await text(localizedStrings.newAddress.breadcrumb).exists(),
      ).toBeTruthy();

      await write(
        "42 Test Road",
        into(
          textBox({
            placeholder: localizedStrings.newAddress.streetAddressPlaceholder,
          }),
        ),
      );
      await write(
        "Test City",
        into(
          textBox({
            placeholder: localizedStrings.newAddress.localityPlaceholder,
          }),
        ),
      );
      await write(
        "42420",
        into(
          textBox({
            placeholder: localizedStrings.newAddress.postalCodePlaceholder,
          }),
        ),
      );
      await write(
        "Testland",
        into(
          textBox({
            placeholder: localizedStrings.newAddress.countryPlaceholder,
          }),
        ),
      );
      await write(
        "Home",
        into(
          textBox({
            placeholder: localizedStrings.newAddress.addressKindPlaceholder,
          }),
        ),
      );

      await click(localizedStrings.newAddress.add);
      await waitFor(2000);
      expect(await currentURL()).toEqual(`${baseURL}/account/profile/`);

      if (isStagingEnv) {
        expect(
          await text(localizedStrings.profileOverview.addAddress).exists(),
        ).toBeTruthy();
        await click(text(localizedStrings.profileOverview.addAddress));

        expect(
          await text(localizedStrings.newAddress.breadcrumb).exists(),
        ).toBeTruthy();

        await write(
          "23 Test Road",
          into(
            textBox({
              placeholder: localizedStrings.newAddress.streetAddressPlaceholder,
            }),
          ),
        );
        await write(
          "Test City",
          into(
            textBox({
              placeholder: localizedStrings.newAddress.localityPlaceholder,
            }),
          ),
        );
        await write(
          "42420",
          into(
            textBox({
              placeholder: localizedStrings.newAddress.postalCodePlaceholder,
            }),
          ),
        );
        await write(
          "Testland",
          into(
            textBox({
              placeholder: localizedStrings.newAddress.countryPlaceholder,
            }),
          ),
        );
        await write(
          "Work",
          into(
            textBox({
              placeholder: localizedStrings.newAddress.addressKindPlaceholder,
            }),
          ),
        );

        await click(localizedStrings.newAddress.add);
        await waitFor(2000);
        expect(await currentURL()).toEqual(`${baseURL}/account/profile/`);
      }

      printStep("Address update");
      await click(
        link("", below(localizedStrings.profileOverview.addressesSection)),
      );
      expect(
        await text(localizedStrings.addressOverview.primary).exists(),
      ).toBeTruthy();

      await click(localizedStrings.addressOverview.update);
      expect(
        await text(localizedStrings.editAddress.breadcrumb).exists(),
      ).toBeTruthy();

      await clear(textBox(localizedStrings.editAddress.streetAddressLabel));
      await write(
        "21b Baker Street",
        into(
          textBox({
            placeholder: localizedStrings.editAddress.streetAddressPlaceholder,
          }),
        ),
      );

      await click(localizedStrings.editAddress.update, {
        waitForEvents: ["loadEventFired"],
      });

      expect(await currentURL()).toEqual(profileUrl);

      printStep("Mark address as primary");
      await click(localizedStrings.navigation.personalInformation);

      expect(
        await text(localizedStrings.profileOverview.showMore).exists(),
      ).toBeTruthy();
      await click(localizedStrings.profileOverview.showMore);
      await click(link("Work"));

      expect(
        await text(localizedStrings.addressOverview.mark).exists(),
      ).toBeTruthy();
      await click(localizedStrings.addressOverview.mark);
      expect(
        await text(localizedStrings.addressOverview.infoMark).exists(),
      ).toBeTruthy();
      await click(localizedStrings.addressOverview.confirm);

      expect(await currentURL()).toEqual(`${baseURL}/account/profile/`);

      printStep("Address delete");
      await click(
        link("", below(localizedStrings.profileOverview.addressesSection)),
      );
      expect(
        await text(localizedStrings.addressOverview.primary).exists(),
      ).toBeTruthy();

      await click(localizedStrings.addressOverview.delete);
      expect(
        await text(localizedStrings.addressOverview.infoDelete).exists(),
      ).toBeTruthy();
      await click(localizedStrings.addressOverview.deleteButton, {
        waitForEvents: ["loadEventFired"],
      });

      expect(await currentURL()).toEqual(profileUrl);

      if (isStagingEnv) {
        await click(
          link("", below(localizedStrings.profileOverview.addressesSection)),
        );
        expect(
          await text(localizedStrings.addressOverview.primary).exists(),
        ).toBeTruthy();

        await click(localizedStrings.addressOverview.delete);
        expect(
          await text(localizedStrings.addressOverview.infoDelete).exists(),
        ).toBeTruthy();
        await click(localizedStrings.addressOverview.deleteButton, {
          waitForEvents: ["loadEventFired"],
        });

        expect(await currentURL()).toEqual(profileUrl);
      }
    } catch (error) {
      await screenshot({
        path: "./tests/e2e/screenshots/profile-happy-path.png",
      });
      throw error;
    }
  });
});
