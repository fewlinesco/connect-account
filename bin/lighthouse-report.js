/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");

let COUNTER = 0;
const SCREENSHOTS_DIR_PATH = "/home/circleci/project/screenshots";

function getTargetedPath(number) {
  return `${SCREENSHOTS_DIR_PATH}/#${COUNTER}_${number}.png`;
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

  console.log("Page opened.");
  await page.goto(process.env.CONNECT_TEST_ACCOUNT_URL);
  await page.screenshot({
    path: getTargetedPath(2),
  });
  console.log("App loaded.");

  await page.click("a");
  console.log("Login button clicked.");
  await page.waitForTimeout(5000);

  await page.screenshot({
    path: getTargetedPath(3),
  });
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

  await page.screenshot({
    path: getTargetedPath(4),
  });
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
  await page.screenshot({
    path: getTargetedPath(5),
  });
  await page.waitForTimeout(5000);

  if ((await page.$("[type=submit]")) !== null) {
    await page.click("[type=submit]");
  }

  await page.waitForTimeout(5000);
  await page.screenshot({
    path: getTargetedPath(6),
  });
}

async function setup(browser, context) {
  if (!fs.existsSync(SCREENSHOTS_DIR_PATH)) {
    fs.mkdirSync(SCREENSHOTS_DIR_PATH);
  }

  const page = await browser.newPage();
  await page.setCacheEnabled(true);

  if (COUNTER !== 1) {
    await page.goto(context.url);
  } else {
    await login(page);
    await page.screenshot({
      path: getTargetedPath(1),
    });
  }

  await page.screenshot({
    path: getTargetedPath(7),
  });

  await page.close();
  COUNTER++;
}

module.exports = setup;
