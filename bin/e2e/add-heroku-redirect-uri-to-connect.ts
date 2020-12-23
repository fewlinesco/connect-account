import { updateApplication } from "../../lib/commands/updateApplication";
import { getApplication } from "../../lib/queries/getApplication";

async function addHerokuRedirectURIToConnect(): Promise<void> {
  if (process.env.CONNECT_ACCOUNT_TEST_APP_ID === undefined) {
    throw new Error(
      "CONNECT_ACCOUNT_TEST_APP_ID environment variable is undefined",
    );
  }

  if (process.env.HEROKU_APP_NAME === undefined) {
    throw new Error("HEROKU_APP_NAME environment variable is undefined");
  }

  console.log(process.env.HEROKU_APP_NAME);

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

  const herokuDeploymentUrl =
    "https://" +
    process.env.HEROKU_APP_NAME +
    ".herokuapp.com/api/oauth/callback";

  if (!testApp.redirectUris.includes(herokuDeploymentUrl)) {
    const updatedTestApp = {
      ...testApp,
      redirectUris: [...testApp.redirectUris, herokuDeploymentUrl],
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

addHerokuRedirectURIToConnect();
