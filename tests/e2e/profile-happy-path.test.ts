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
  goto,
} from "taiko";

import { authenticateToConnect } from "./utils/authenticate-to-connect";
import * as locales from "@content/locales";
import { configVariables } from "@src/configs/config-variables";

describe.only("Profile happy path", () => {
  jest.setTimeout(120000);

  const baseURL = (
    process.env.CONNECT_TEST_ACCOUNT_URL || configVariables.connectAccountURL
  ).replace(/\/?$/, "");

  const profileUrl = `${baseURL}/account/profile`;

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

  beforeEach(async () => {
    await authenticateToConnect();
  });

  afterAll(async () => {
    await closeBrowser();
  });

  const isStagingEnv = (
    process.env.CONNECT_PROFILE_URL || configVariables.connectProfileUrl
  ).includes("staging");

  test("it should do Profile flows' happy path", async () => {
    try {
      // Profile creation
      if (isStagingEnv) {
        await click(localizedStrings.navigation.createYourProfile);
        expect(
          await text(localizedStrings.newProfile.breadcrumb).exists(),
        ).toBeTruthy();

        waitFor(1000);
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
        waitFor(
          async () =>
            await text(
              localizedStrings.navigation.personalInformation,
            ).exists(),
        );
        await click(localizedStrings.navigation.personalInformation);
      }

      // Update user profile flow
      waitFor(
        async () =>
          await text(localizedStrings.profileOverview.updateInfo).exists(),
      );

      await click(localizedStrings.profileOverview.updateInfo);

      await text(localizedStrings.editProfile.breadcrumb).exists();

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
      expect(await currentURL()).toEqual(`${baseURL}/account/profile`);
    } catch (error) {
      await screenshot({
        path: "./tests/e2e/screenshots/profile-happy-path.png",
      });
      throw error;
    }
  });

  test("it should do Addresses flows' happy path", async () => {
    try {
      // Add address flow
      await goto(profileUrl);

      await click(text(localizedStrings.profileOverview.addAddress));

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
      expect(await currentURL()).toEqual(`${baseURL}/account/profile`);

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
        expect(await currentURL()).toEqual(`${baseURL}/account/profile`);
      }

      // Update address flow
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

      await click(localizedStrings.editAddress.update);
      expect(await currentURL()).toEqual(profileUrl);

      // Mark address as primary flow
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

      expect(await currentURL()).toEqual(`${baseURL}/account/profile`);

      // Delete address flow
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
      await click(localizedStrings.addressOverview.deleteButton);

      expect(await currentURL()).toEqual(`${baseURL}/account/profile`);

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
        await click(localizedStrings.addressOverview.deleteButton);

        expect(await currentURL()).toEqual(`${baseURL}/account/profile`);
      }
    } catch (error) {
      await screenshot({
        path: "./tests/e2e/screenshots/addresses-happy-path.png",
      });
      throw error;
    }
  });
});
