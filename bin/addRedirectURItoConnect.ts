import { updateApplication } from "../lib/commands/updateApplication";
import { getApplication } from "../lib/queries/getApplication";
import { config } from "../src/config";

const addingRedirectURIToConnect = async (): Promise<any> => {
  try {
    if (process.env.GITHUB_CONTEXT_EVENT === undefined)
      throw new Error("githubContextEvent is undefined");

    const githubActionsContext = JSON.parse(process.env.GITHUB_CONTEXT_EVENT);

    if (githubActionsContext.deployment_status === undefined)
      throw new Error("deploymentStatus is undefined");

    const vercelDeployment = githubActionsContext.deployment_status;

    if (vercelDeployment.state === "success") {
      const testApp = await getApplication(config.connectAccountTestAppId).then(
        (results) => {
          if (results.errors) {
            throw results.errors;
          }

          if (!results.data) {
            throw new Error("app not found");
          }

          return results.data.provider.application;
        },
      );

      testApp.redirectUris.push(vercelDeployment.target_url);

      await updateApplication(testApp).then((results) => {
        if (results.errors) {
          throw results.errors;
        }

        if (!results.data) {
          throw new Error("update error");
        }

        return results.data;
      });
    }
  } catch (error) {
    console.log(error);
  }
};

addingRedirectURIToConnect();
