import { text, click, screenshot, waitFor, write, press } from "taiko";

export async function authToConnect(): Promise<void> {
  if (process.env.CONNECT_ACCOUNT_TEST_EMAIL === undefined) {
    throw new Error(
      "CONNECT_ACCOUNT_TEST_EMAIL environment variable is undefined",
    );
  }

  if (process.env.CONNECT_ACCOUNT_TEST_PASSWORD === undefined) {
    throw new Error(
      "CONNECT_ACCOUNT_TEST_PASSWORD environment variable is undefined",
    );
  }

  try {
    await waitFor("Access my account");
    expect(await text("Access my account").exists()).toBeTruthy();
    await click("Access my account");

    await waitFor("Email");
    expect(await text("Email").exists()).toBeTruthy();
    await write(process.env.CONNECT_ACCOUNT_TEST_EMAIL);
    await press("Enter");

    await waitFor("Password");
    expect(await text("Password").exists()).toBeTruthy();
    await write(process.env.CONNECT_ACCOUNT_TEST_PASSWORD);
    await press("Enter");
  } catch (error) {
    await screenshot({
      path: "tests/e2e/screenshots/auth-to-connect.png",
    });

    throw error;
  }
}
