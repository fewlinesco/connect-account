import { deleteUser } from "../../lib/commands/delete-user";
import { getUserIDFromIdentityValue } from "../../lib/queries/get-user-id-from-identity-value";

async function removeTestUser(): Promise<void> {
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

  const githubDeploymentStatus = githubActionsContext.deployment_status;

  if (!githubDeploymentStatus.environment.includes("storybook")) {
    if (githubDeploymentStatus.state === "success") {
      const testUserEmail = process.env.CONNECT_TEST_ACCOUNT_EMAIL.split(
        "@",
      ).join("_" + githubActionsContext.deployment.sha + "@");

      const testUserId = await getUserIDFromIdentityValue({
        value: testUserEmail,
      }).then(({ data, errors }) => {
        if (errors) {
          throw errors;
        }

        if (!data) {
          throw new Error("User not found.");
        }

        return data.provider.user.id;
      });

      await deleteUser({ userId: testUserId }).then(({ data, errors }) => {
        if (errors) {
          throw errors;
        }

        if (!data) {
          throw new Error("Deleting error");
        }
      });
    }
  }
}

removeTestUser();
