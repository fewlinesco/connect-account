import {
  deleteUser,
  getUserIdFromIdentityValue,
} from "@fewlines/connect-management";

async function removeTestUser(): Promise<void> {
  if (process.env.GITHUB_CONTEXT_EVENT === undefined) {
    throw new Error("GITHUB_CONTEXT_EVENT environment variable is undefined");
  }

  const githubActionsContext = JSON.parse(process.env.GITHUB_CONTEXT_EVENT);

  if (githubActionsContext.deployment === undefined) {
    throw new Error("deployment is undefined");
  }

  if (process.env.CONNECT_TEST_ACCOUNT_EMAIL === undefined) {
    throw new Error(
      "CONNECT_TEST_ACCOUNT_EMAIL environment variable is undefined",
    );
  }

  if (process.env.CONNECT_MANAGEMENT_URL === undefined) {
    throw new Error("CONNECT_MANAGEMENT_URL environment variable is undefined");
  }

  if (process.env.CONNECT_MANAGEMENT_API_KEY === undefined) {
    throw new Error(
      "CONNECT_MANAGEMENT_API_KEY environment variable is undefined",
    );
  }

  const testUserEmail = process.env.CONNECT_TEST_ACCOUNT_EMAIL.split("@").join(
    "_" + githubActionsContext.deployment.sha + "@",
  );

  const testUserId = await getUserIdFromIdentityValue(
    {
      URI: process.env.CONNECT_MANAGEMENT_URL,
      APIKey: process.env.CONNECT_MANAGEMENT_API_KEY,
    },
    testUserEmail,
  );

  await deleteUser(
    {
      URI: process.env.CONNECT_MANAGEMENT_URL,
      APIKey: process.env.CONNECT_MANAGEMENT_API_KEY,
    },
    testUserId,
  );
}

removeTestUser();
