import {
  createOrUpdatePassword,
  createUserWithIdentities,
} from "@fewlines/connect-management";
import {
  IdentityStatus,
  IdentityTypes,
} from "@fewlines/connect-management/dist/src/types";

async function createTestUser(): Promise<void> {
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

  if (process.env.CONNECT_TEST_ACCOUNT_PASSWORD === undefined) {
    throw new Error(
      "CONNECT_TEST_ACCOUNT_PASSWORD environment variable is undefined",
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

  const userIdentitiesInput = [
    {
      status: IdentityStatus.VALIDATED,
      type: IdentityTypes.EMAIL,
      value: process.env.CONNECT_TEST_ACCOUNT_EMAIL.split("@").join(
        "_" + githubActionsContext.deployment.sha + "@",
      ),
    },
    {
      status: IdentityStatus.VALIDATED,
      type: IdentityTypes.EMAIL,
      value: process.env.CONNECT_TEST_ACCOUNT_EMAIL.split("@").join(
        "_delete_" + githubActionsContext.deployment.sha + "@",
      ),
    },
    {
      status: IdentityStatus.VALIDATED,
      type: IdentityTypes.EMAIL,
      value: process.env.CONNECT_TEST_ACCOUNT_EMAIL.split("@").join(
        "2_" + githubActionsContext.deployment.sha + "@",
      ),
    },
  ];

  const userId = await createUserWithIdentities(
    {
      URI: process.env.CONNECT_MANAGEMENT_URL,
      APIKey: process.env.CONNECT_MANAGEMENT_API_KEY,
    },
    {
      identities: userIdentitiesInput,
      localeCode: "en-US",
    },
  );

  await createOrUpdatePassword(
    {
      URI: process.env.CONNECT_MANAGEMENT_URL,
      APIKey: process.env.CONNECT_MANAGEMENT_API_KEY,
    },
    {
      cleartextPassword: process.env.CONNECT_TEST_ACCOUNT_PASSWORD.trim(),
      userId,
    },
  );
}

createTestUser();
