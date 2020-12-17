import { updateApplication } from "../../lib/commands/updateApplication";
import { getApplication } from "../../lib/queries/getApplication";

async function addVercelRedirectURIToConnect(): Promise<void> {
  if (process.env.GITHUB_CONTEXT_EVENT === undefined) {
    throw new Error("GITHUB_CONTEXT_EVENT environment variable is undefined");
  }

  const githubActionsContext = JSON.parse(process.env.GITHUB_CONTEXT_EVENT);

  console.log(githubActionsContext);

  if (process.env.CONNECT_ACCOUNT_TEST_APP_ID === undefined) {
    throw new Error(
      "CONNECT_ACCOUNT_TEST_APP_ID environment variable is undefined",
    );
  }

  if (githubActionsContext.deployment_status === undefined) {
    throw new Error("deployment_status is undefined");
  }

  const githubDeploymentStatus = githubActionsContext.deployment_status;

  const deploymentStates = ["success", "pending", "in_progress", "queued"];

  if (!githubDeploymentStatus.environment.includes("storybook")) {
    if (deploymentStates.includes(githubDeploymentStatus.state)) {
      const testApp = await getApplication(
        process.env.CONNECT_ACCOUNT_TEST_APP_ID,
      ).then(({ errors, data }) => {
        if (errors) {
          throw errors;
        }

        if (!data) {
          throw new Error("Connect Application not found");
        }

        return data.provider.application;
      });

      const vercelDeploymentUrl =
        githubDeploymentStatus.target_url + "/api/oauth/callback";

      if (!testApp.redirectUris.includes(vercelDeploymentUrl)) {
        const updatedTestApp = {
          ...testApp,
          redirectUris: [...testApp.redirectUris, vercelDeploymentUrl],
        };

        await updateApplication(updatedTestApp).then(({ errors, data }) => {
          if (errors) {
            throw errors;
          }

          if (!data) {
            throw new Error("update error");
          }
        });
      }
    }
  }
}

addVercelRedirectURIToConnect();
