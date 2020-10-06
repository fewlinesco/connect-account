import puppeteer from "puppeteer";

import { config } from "./config";

describe("Account Web Application", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  const { accountURL, ...browserOptions } = config({ debug: false });

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

  it("should display 'Login' text on '/'", async (done) => {
    expect.assertions(1);

    await page
      .goto(accountURL)
      .then(() => expect(page).toMatch("Login"))
      .catch(() =>
        page.screenshot({ path: "screenshots/error_on_index_page.png" }),
      )
      .finally(() => done());
  });
});
