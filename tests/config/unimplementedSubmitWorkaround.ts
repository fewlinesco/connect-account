// Following code mocks window.console.error
// to ignore the "Not implemented: HTMLFormElement.prototype.submit".
//
// Problem: We use "form.onsubmit" event listener in some tests,
// but HTMLFormElement.prototype.submit is not implemented in JSDOM,
// although the tests are passing and handler fires.
//
// More:
// https://github.com/jsdom/jsdom/issues/1937
// https://github.com/facebook/jest/issues/5223#issuecomment-489422244

// ❗This file is not meant to be a console error bypass, do not modify ❗

let origErrorConsole: Console["error"];

beforeEach(() => {
  origErrorConsole = globalThis.console.error;

  globalThis.console.error = (...args: string[]) => {
    const firstArg = args.length > 0 && args[0];

    const shouldBeIgnored =
      firstArg &&
      typeof firstArg === "string" &&
      firstArg.includes("Not implemented: HTMLFormElement.prototype.submit");

    if (!shouldBeIgnored) {
      origErrorConsole(...args);
    }
  };
});

afterEach(() => {
  globalThis.console.error = origErrorConsole;
});

export {};
