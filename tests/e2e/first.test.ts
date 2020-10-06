import puppeteer from "puppeteer";

import { config } from "./config";

jest.setTimeout(30000);

describe("Account Web Application", () => {
  // let page: any = "";

  // beforeAll(async () => {
  // await puppeteer.launch({
  //   headless: false,
  //   slowMo: 250, // slowdown by 250 ms
  // });

  // page = await browser.newPage();

  // await page.goto("https://google.com");
  // });

  // afterEach(async () => {
  //   await browser.close();
  // });

  it('should display "Login" text on page', async () => {
    const browser = await puppeteer.launch({
      headless: config.headless,
      slowMo: config.slowMo,
    });
    const page = await browser.newPage();
    await page.goto(config.accountURL, {
      waitUntil: "networkidle2",
    });

    await expect(page).toMatch("Login");

    await browser.close();
  });

  test("happy path", async () => {
    const browser = await puppeteer.launch({
      headless: config.headless,
      slowMo: config.slowMo,
    });
    const page = await browser.newPage();
    await page.goto(config.accountURL, {
      waitUntil: "networkidle2",
    });

    await browser.close();
  });
});
