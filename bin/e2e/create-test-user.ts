import { IdentityStatus, IdentityTypes } from "../../lib/@types";
import { createOrUpdatePassword } from "../../lib/commands/createOrUpdatePassword";
import { createUserWithIdentities } from "../../lib/commands/createUserWithIdentities";

async function createTestUser(): Promise<void> {
  if (process.env.GITHUB_CONTEXT_EVENT === undefined) {
    throw new Error("GITHUB_CONTEXT_EVENT environment variable is undefined");
  }

  const githubActionsContext = JSON.parse(process.env.GITHUB_CONTEXT_EVENT);

  if (githubActionsContext.deployment === undefined) {
    throw new Error("deployment is undefined");
  }

  if (githubActionsContext.deployment_status === undefined) {
    throw new Error("deployment_status is undefined");
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

  const githubDeploymentStatus = githubActionsContext.deployment_status;

  if (!githubDeploymentStatus.environment.includes("storybook")) {
    if (githubDeploymentStatus.state === "success") {
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
            "2_" + githubActionsContext.deployment.sha + "@",
          ),
        },
      ];

      const userId = await createUserWithIdentities({
        identities: userIdentitiesInput,
        localeCode: "en-US",
      }).then(({ data, errors }) => {
        if (errors) {
          throw errors;
        }

        if (!data) {
          throw new Error("User creation error");
        }

        return data.createUserWithIdentities.id;
      });

      await createOrUpdatePassword({
        cleartextPassword: process.env.CONNECT_TEST_ACCOUNT_PASSWORD.trim(),
        userId,
      }).then(({ data, errors }) => {
        if (errors) {
          throw errors;
        }

        if (!data) {
          throw new Error("Password error");
        }
      });
    }
  }
}

createTestUser();
