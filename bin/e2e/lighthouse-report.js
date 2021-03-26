class LighthouseReport {
  getUrls() {
    if (process.env.CONNECT_TEST_ACCOUNT_URL === undefined) {
      throw new Error(
        "CONNECT_TEST_ACCOUNT_URL environment variable is undefined",
      );
    }

    const reviewAppURL = process.env.CONNECT_TEST_ACCOUNT_URL;
    console.log("getUrls", reviewAppURL);
    return [reviewAppURL];
  }

  /* eslint-disable no-async-promise-executor */
  connect(browser) {
    if (process.env.CONNECT_TEST_ACCOUNT_URL === undefined) {
      throw new Error(
        "CONNECT_TEST_ACCOUNT_URL environment variable is undefined",
      );
    }

    if (process.env.CONNECT_TEST_ACCOUNT_EMAIL === undefined) {
      throw new Error(
        "CONNECT_TEST_ACCOUNT_EMAIL environment variable is undefined",
      );
    }

    if (process.env.CONNECT_TEST_ACCOUNT_PASSWORD === undefined) {
      throw new Error(
        "CONNECT_TEST_ACCOUNT_PASSWORD environment variable is undefined",
      );
    }

    return new Promise(async (resolve, _reject) => {
      const reviewAppURL = process.env.CONNECT_TEST_ACCOUNT_URL;

      const page = await browser.newPage();
      console.log("Page open");
      await page.goto(reviewAppURL);
      console.log("App loaded");

      await page.click("a");
      console.log("Login button clicked");
      await page.waitForTimeout(5000);

      await page.waitForSelector("input[type=email]", {
        visible: true,
        timeout: 0,
      });
      await page.type(
        "input[type=email]",
        process.env.CONNECT_TEST_ACCOUNT_EMAIL,
        {
          delay: 50,
        },
      );
      await page.click("[type=submit]");
      await page.waitForTimeout(5000);

      await page.waitForSelector("input[type=password]", {
        visible: true,
        timeout: 0,
      });
      await page.type(
        "input[type=password]",
        process.env.CONNECT_TEST_ACCOUNT_PASSWORD,
        {
          delay: 50,
        },
      );
      await page.click("[type=submit]");
      await page.waitForTimeout(10000);

      console.log(await page.content());

      resolve(browser);
    });
  }
}

module.exports = new LighthouseReport();
