import { updateApplication } from "../lib/commands/updateApplication";
import { getApplication } from "../lib/queries/getApplication";
import { config } from "../src/config";

const removeRedirectURIFromConnect = async (): Promise<any> => {
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

  const initialStateTestApp = {
    ...testApp,
    redirectUris: testApp.redirectUris.filter((uri) => !uri.includes("vercel")),
  };

  await updateApplication(initialStateTestApp).then((results) => {
    if (results.errors) {
      throw results.errors;
    }

    if (!results.data) {
      throw new Error("update error");
    }

    return results.data;
  });
};

removeRedirectURIFromConnect();

export {};
