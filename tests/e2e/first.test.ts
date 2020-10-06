import puppeteer from "puppeteer";

import { config } from "./config";

jest.setTimeout(30000);

describe("Account Web Application", () => {
  let page: puppeteer.Page;

  beforeAll(async () => {
    await puppeteer.launch({
      headless: config.headless,
      slowMo: config.slowMo,
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  afterEach(async () => {
    await jestPuppeteer.resetPage();
  });

  it('should display "Login" text on page', async () => {
    console.log(page);

    await page.goto(config.accountURL, {
      waitUntil: "networkidle2",
    });

    await expect(page).toMatch("Login");
  });

  test("happy path", async () => {});
});

// const browser = await puppeteer.launch({
//   headless: config.headless,
//   slowMo: config.slowMo,
// });
// const page = await browser.newPage();
// await page.goto(config.accountURL, {
//   waitUntil: "networkidle2",
// });
// await browser.close();
