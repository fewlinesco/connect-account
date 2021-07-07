// let counter = 0;

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

  console.log("Page opened.");
  await page.goto(process.env.CONNECT_TEST_ACCOUNT_URL);
  console.log("App loaded.");

  await page.click("a");
  console.log("Login button clicked.");
  await page.waitForTimeout(5000);

  await page.waitForSelector("input[type=email]", {
    visible: true,
    timeout: 0,
  });
  await page.type("input[type=email]", process.env.CONNECT_TEST_ACCOUNT_EMAIL, {
    delay: 50,
  });
  await page.click("[type=submit]");
  console.log("Email submitted.");
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
  console.log("Password submitted.");

  await page.waitForTimeout(5000);
}

async function setup(browser) {
  const page = await browser.newPage();
  await page.setCacheEnabled(true);

  // if (counter === 0) {
  //   await page.goto(context.url);
  // } else {
  //   await login(page);
  // }

  await login(page);

  await page.close();
  // counter++;
}

module.exports = setup;
