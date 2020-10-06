import puppeteer from "puppeteer";

import { config } from "./config";

jest.setTimeout(30000);

describe("Account Web Application", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  const { accountURL, ...browserOptions } = config;

  beforeAll(async () => {
    browser = await puppeteer.launch(browserOptions);
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should display "Login" text on page', async (done) => {
    expect.assertions(1);

    await page.goto(accountURL, {
      waitUntil: "networkidle2",
    });

    await page.screenshot({ path: "screenshots/screenshot.png" });

    await expect(page).toMatch("Login");

    done();
  });
});
