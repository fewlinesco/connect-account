import { LaunchOptions } from "puppeteer";

interface Config extends LaunchOptions {
  accountURL: string;
}

export function config({ debug = false }: { debug: boolean }): Config {
  if (debug) {
    return {
      headless: false,
      slowMo: 420,
      defaultViewport: {
        width: 320,
        height: 568,
      },
      devtools: true,
      accountURL: "http://localhost:29703/",
    };
  }

  return {
    product: "chrome",
    ignoreHTTPSErrors: true,
    headless: true,
    accountURL: "http://localhost:29703/",
  };
}
