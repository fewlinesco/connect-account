let counter = 1;

async function login(page) {
  // const reviewAppURL = process.env.CONNECT_TEST_ACCOUNT_URL;
  const reviewAppURL = "https://account-staging.fewlines.tech/";

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
  await page.type("input[type=email]", process.env.CONNECT_TEST_ACCOUNT_EMAIL, {
    delay: 50,
  });
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
}

async function setup(browser, context) {
  const page = await browser.newPage();
  await page.setCacheEnabled(true);

  if (counter === 1) {
    await login(page);
  } else {
    await page.goto(context.url);
  }
  // close session for next run
  await page.close();
  counter++;
}

module.exports = setup;
