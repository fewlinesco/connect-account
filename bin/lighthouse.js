// This is a modified version of https://github.com/GoogleChrome/lighthouse/blob/master/docs/recipes/auth/example-lh-auth.js.
"use strict";

/* eslint-disable @typescript-eslint/no-var-requires */
const lighthouse = require("lighthouse");
const puppeteer = require("puppeteer");

/**
 * @param {import('puppeteer').Browser} browser
 * @param {string} origin
 */
async function login(browser, origin) {
  const page = await browser.newPage();
  await page.goto(origin);

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

  await page.close();
}

/**
 * @param {puppeteer.Browser} browser
 * @param {string} origin
 */
async function logout(browser, origin) {
  const page = await browser.newPage();
  await page.goto(`${origin}/logout`);
  await page.close();
}

async function main() {
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

  const PORT = 8041;
  const hostname = process.env.CONNECT_TEST_ACCOUNT_PASSWORD;
  const url = `${hostname}/account/logins`;
  const browser = await puppeteer.launch({
    args: [`--remote-debugging-port=${PORT}`],
    headless: true,
  });

  await login(browser, hostname);
  const result = await lighthouse(url, {
    port: PORT,
    disableStorageReset: true,
  });

  await browser.close();

  console.log(JSON.stringify(result.lhr, null, 2));
}

if (require.main === module) {
  main();
} else {
  module.exports = {
    login,
    logout,
  };
}
