class LighthouseReport {
  getUrls() {
    const reviewAppURL = process.env.CONNECT_TEST_ACCOUNT_URL;
    console.log("getUrls", reviewAppURL);
    return [reviewAppURL];
  }

  /* eslint-disable no-async-promise-executor */
  connect(browser) {
    return new Promise(async (resolve, _reject) => {
      const reviewAppURL = process.env.CONNECT_TEST_ACCOUNT_URL;
      console.log(reviewAppURL);

      const page = await browser.newPage();
      console.log("Page open");
      await page.goto(reviewAppURL);
      console.log("Production open");

      await page.waitForNavigation();
      await page.click("Access my account");
      await page.waitForTimeout(5000);

      await page.waitForNavigation();
      await page.click(".login-button");
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

      resolve(browser);
    });
  }
}

module.exports = new LighthouseReport();
