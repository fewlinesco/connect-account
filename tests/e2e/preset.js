const puppeteer_preset = require("jest-puppeteer/jest-preset");
const ts_preset = require("ts-jest/jest-preset");

module.exports = Object.assign(ts_preset, puppeteer_preset);
