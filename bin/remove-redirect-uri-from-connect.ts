//import { updateApplication } from "../lib/commands/updateApplication";
import { getApplication } from "../lib/queries/getApplication";

async function removeRedirectURIFromConnect(): Promise<void> {
  if (process.env.CONNECT_ACCOUNT_TEST_APP_ID === undefined) {
    throw new Error(
      "CONNECT_ACCOUNT_TEST_APP_ID environment variable is undefined",
    );
  }

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

  console.log(testApp);

  // const initialStateTestApp = {
  //   ...testApp,
  //   redirectUris: testApp.redirectUris.filter((uri) => !uri.includes("vercel")),
  // };

  // await updateApplication(initialStateTestApp).then(({ errors, data }) => {
  //   if (errors) {
  //     throw errors;
  //   }

  //   if (!data) {
  //     throw new Error("update error");
  //   }
  // });
}

removeRedirectURIFromConnect();
