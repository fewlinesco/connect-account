let counter = 1;

async function login(page) {
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

  const reviewAppURL = "https://fewlines-account-staging.herokuapp.com/";

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

  console.log("URL", context.url);

  if (counter === 1) {
    await login(page);
  } else {
    await page.goto(context.url);
  }

  await page.close();
  counter++;
}

module.exports = setup;
