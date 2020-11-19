import fetch from "node-fetch";

const addingRedirectURIToConnect = async (): Promise<any> => {
  try {
    if (process.env.GITHUB_CONTEXT_EVENT === undefined)
      throw new Error("githubContextEvent undefined");

    const githubActionsContext = JSON.parse(process.env.GITHUB_CONTEXT_EVENT);

    if (githubActionsContext.deployment_status.deployment_url === undefined)
      throw new Error("deploymentUrl undefined");

    const deploymentUrl = githubActionsContext.deployment_status.deployment_url;

    const deploymentStatusesUrl = await fetch(deploymentUrl)
      .then((response) => response.json())
      .then((data) => data.statuses_url);

    const vercelDeploymentUrl = await fetch(deploymentStatusesUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data[0].state === "success") {
          return data[0].target_url;
        }
      });

    console.log("vercelDeploymentUrl: " + vercelDeploymentUrl);
  } catch (error) {
    console.log(error);
  }
};

addingRedirectURIToConnect();
