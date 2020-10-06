import { LaunchOptions } from "puppeteer";

interface Config extends LaunchOptions {
  accountURL: string;
}

export const config: Config = {
  product: "chrome",
  ignoreHTTPSErrors: false,
  headless: false,
  slowMo: 300,
  defaultViewport: {
    width: 320,
    height: 568,
  },
  devtools: true,
  accountURL: "http://localhost:29703/",
};
