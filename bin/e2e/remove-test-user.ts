import { IdentityTypes } from "../../lib/@types";
import { deleteUser } from "../../lib/commands/deleteUser";
import { getUserFiltersByProvider } from "../../lib/queries/getUserFiltersByProvider";

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
      console.log("SHA: ", githubActionsContext.deployment.sha);

      const testUserEmail = process.env.CONNECT_TEST_ACCOUNT_EMAIL.split(
        "@",
      ).join("_" + githubActionsContext.deployment.sha + "@");

      console.log(testUserEmail);

      const testUserId = await getUserFiltersByProvider({
        value: testUserEmail,
        type: IdentityTypes.EMAIL,
      }).then(({ data, errors }) => {
        if (errors) {
          throw errors;
        }

        if (!data) {
          throw new Error("User not found.");
        }
        return data.provider.user.id;
      });

      console.log(testUserId);

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
