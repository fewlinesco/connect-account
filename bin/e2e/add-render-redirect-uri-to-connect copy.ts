import { updateApplication } from "../../lib/commands/updateApplication";
import { getApplication } from "../../lib/queries/getApplication";

async function addRenderRedirectURIToConnect(): Promise<void> {
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

  if (githubActionsContext.pull_request === undefined) {
    throw new Error("pull_request is undefined");
  }

  const githubPullRequest = githubActionsContext.pull_request;

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

  const renderDeploymentUrl =
    "https://connect-account-pr-" +
    githubPullRequest.number +
    ".onrender.com/api/oauth/callback";

  console.log(renderDeploymentUrl);

  if (!testApp.redirectUris.includes(renderDeploymentUrl)) {
    const updatedTestApp = {
      ...testApp,
      redirectUris: [...testApp.redirectUris, renderDeploymentUrl],
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

addRenderRedirectURIToConnect();
