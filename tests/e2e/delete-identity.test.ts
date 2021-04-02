import {
  openBrowser,
  closeBrowser,
  text,
  click,
  screenshot,
  link,
  waitFor,
} from "taiko";

import { authenticateToConnect } from "./utils/authenticate-to-connect";

describe("Delete Identity", () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    await openBrowser({
      args: [
        "--window-size=1440,1000",
        "--no-sandbox",
        "--start-maximized",
        "--disable-dev-shm",
      ],
      headless: true,
      observe: false,
      observeTime: 1000,
    });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("It should navigate to the show of the Identity, and delete it", async (done) => {
    expect.assertions(13);

    try {
      await authenticateToConnect();

      expect(await text("Logins").exists()).toBeTruthy();
      await click("Logins");

      expect(await text("Show").exists()).toBeTruthy();
      await click("Show");

      // const identityToDeleteText = await link("_delete_").text();

      expect(await link("_delete_").exists()).toBeTruthy();
      await click(link("_delete_"));

      expect(await text("Delete this email address").exists()).toBeTruthy();
      await click(text("Delete this email address"));

      expect(await text("You are about to delete").exists()).toBeTruthy();
      expect(await text("Delete this email address").exists()).toBeTruthy();
      await click("Delete this email address");

      expect(
        await text("Email address has been deleted").exists(),
      ).toBeTruthy();

      // console.log("before: ", Date.now());

      // Waiting to remove SWR cache.
      await waitFor(2000);

      // console.log("after: ", Date.now());

      // console.log(getConfig());

      // await waitFor("Show 1 more");

      expect(await text("Show").exists()).toBeTruthy();
      await click("Show");
      // await click("Show", {
      //   waitForEvents: ["loadEventFired"],
      //   navigationTimeout: 50000,
      //   waitForStart: 3000,
      // });
      expect(await text("Hide").exists()).toBeTruthy();

      // const identities = await $(
      //   "a",
      //   below("Email addresses"),
      //   above("Hide"),
      // ).elements();

      // const linksInnerText = await Promise.all(
      //   identities.map((el) => {
      //     return evaluate(el, (elem) => {
      //       return elem.innerText;
      //     });
      //   }),
      // );

      // console.log(linksInnerText);

      // console.log(identityToDeleteText);

      // console.log(
      //   linksInnerText.every((linkText) => linkText !== identityToDeleteText),
      // );

      // expect(
      //   linksInnerText.every((linkText) => linkText !== identityToDeleteText),
      // ).toBeTruthy();
      expect(!(await link("_delete_").exists(0, 0))).toBeTruthy();

      done();
    } catch (error) {
      await screenshot({
        path: "tests/e2e/screenshots/delete-identity.png",
      });

      done(error);
    }
  });
});
