import { fetch } from "cross-fetch";

import { updateApplication } from "../lib/commands/updateApplication";
import { getApplication } from "../lib/queries/getApplication";

async function addRedirectURIToConnect(): Promise<void> {
  if (process.env.GITHUB_CONTEXT_EVENT === undefined) {
    throw new Error("GITHUB_CONTEXT_EVENT environment variable is undefined");
  }

  if (process.env.VERCEL_API_TOKEN === undefined) {
    throw new Error("VERCEL_API_TOKEN environment variable is undefined");
  }

  if (process.env.VERCEL_TEAM_ID === undefined) {
    throw new Error("VERCEL_TEAM_ID environment variable is undefined");
  }

  if (process.env.CONNECT_ACCOUNT_TEST_APP_ID === undefined) {
    throw new Error(
      "CONNECT_ACCOUNT_TEST_APP_ID environment variable is undefined",
    );
  }

  const githubActionsContext = JSON.parse(process.env.GITHUB_CONTEXT_EVENT);

  console.log(githubActionsContext);

  if (githubActionsContext.deployment_status === undefined) {
    throw new Error("deployment_status is undefined");
  }

  const githubDeploymentStatus = githubActionsContext.deployment_status;

  const deploymentStates = ["success", "pending", "in_progress", "queued"];

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

    // fetching vercel API for deployment alias url

    const vercelDeploymentUrlWithoutProtocol = githubDeploymentStatus.target_url.replace(
      "https://",
      "",
    );

    const vercelDeploymentInfos = await fetch(
      `https://api.vercel.com/v11/now/deployments/get?url=${vercelDeploymentUrlWithoutProtocol}&teamId=${process.env.VERCEL_TEAM_ID}`,
      { headers: { Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}` } },
    )
      .then((response) => {
        return response.json();
      })
      .catch((errors) => {
        throw errors;
      });

    console.log("vercelDeploymentInfos: ", vercelDeploymentInfos);

    const vercelDeploymentAliasUrl =
      "https://" + vercelDeploymentInfos.alias[0] + "/api/oauth/callback";

    if (
      !githubDeploymentStatus.environment.includes("storybook") &&
      !testApp.redirectUris.includes(vercelDeploymentAliasUrl)
    ) {
      const updatedTestApp = {
        ...testApp,
        redirectUris: [...testApp.redirectUris, vercelDeploymentAliasUrl],
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
