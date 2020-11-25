import { updateApplication } from "../lib/commands/updateApplication";
import { getApplication } from "../lib/queries/getApplication";

async function addRedirectURIToConnect(): Promise<void> {
  if (process.env.GITHUB_CONTEXT_EVENT === undefined) {
    throw new Error("GITHUB_CONTEXT_EVENT environment variable is undefined");
  }

  const githubActionsContext = JSON.parse(process.env.GITHUB_CONTEXT_EVENT);

  if (githubActionsContext.deployment_status === undefined) {
    throw new Error("deployment_status is undefined");
  }

  if (process.env.CONNECT_ACCOUNT_TEST_APP_ID === undefined) {
    throw new Error(
      "CONNECT_ACCOUNT_TEST_APP_ID environment variable is undefined",
    );
  }

  const vercelDeployment = githubActionsContext.deployment_status;

  const deploymentStates = ["success", "pending", "in_progress", "queued"];

  if (deploymentStates.includes(vercelDeployment.state)) {
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

    if (
      !vercelDeployment.target_url.includes("storybook") &&
      !testApp.redirectUris.includes(vercelDeployment.target_url)
    ) {
      const updatedTestApp = {
        ...testApp,
        redirectUris: [...testApp.redirectUris, vercelDeployment.target_url],
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

addRedirectURIToConnect();
