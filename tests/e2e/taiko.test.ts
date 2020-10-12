import {
  openBrowser,
  write,
  closeBrowser,
  goto,
  press,
  text,
  focus,
  toRightOf,
} from "taiko";

describe("Getting Started with Jest and Taiko", () => {
  beforeAll(async () => {
    await openBrowser({ headless: true });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  describe("Search Taiko Repository", () => {
    test("Goto getgauge github page", async () => {
      await goto("https://github.com/getgauge");
    });

    test('Search for "Taiko"', async () => {
      await focus(inputField(toRightOf("Pricing")));
      await write("Taiko");
      await press("Enter");
    });

    test('Page contains "getgauge/taiko"', async () => {
      await expect(text("getgauge/taiko").exists()).toBeTruthy();
    });
  });
});
