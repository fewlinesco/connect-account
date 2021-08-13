let COUNTER = 0;
const SCREENSHOTS_DIR_PATH = "/home/circleci/project/screenshots";

function getTargetedPath(context) {
  return `${SCREENSHOTS_DIR_PATH}/#${COUNTER}_${context}.png`;
}

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

  try {
    // set a consent cookie for the cookie banner to not be displayed by default in mobile
    page.setCookie({ name: "user_content", value: { sentry: true } });

    console.log("Starting auth on Connect.");
    await page.goto(process.env.CONNECT_TEST_ACCOUNT_URL);
    console.log("App loaded.");

    await page.click("a");
    console.log("Login button clicked.");
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

    if ((await page.$("[type=submit]")) !== null) {
      await page.click("[type=submit]");
    }

    return page.waitForTimeout(5000);
  } catch (error) {
    await page.screenshot({
      path: getTargetedPath("login"),
    });

    throw error;
  }
}

async function setup(browser, context) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.setCacheEnabled(true);

  try {
    if (COUNTER !== 1) {
      await page.goto(context.url);
    } else {
      await login(page);
    }

    COUNTER++;
    return page.close();
  } catch (error) {
    await page.screenshot({
      path: getTargetedPath("setup"),
    });

    throw error;
  }
}

module.exports = setup;
