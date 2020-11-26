//import { updateApplication } from "../lib/commands/updateApplication";
import { getApplication } from "../lib/queries/getApplication";

async function removeRedirectURIFromConnect(): Promise<void> {
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

  console.log("githubActionsContext: ", githubActionsContext);
  console.log("=======================================================");

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

  console.log("testApp: ", testApp);
  console.log("=======================================================");

  const filteredRedirectUris = testApp.redirectUris.filter(async (uri) => {
    if (uri.includes(".vercel.app")) {
      const uriWithoutProtocol = uri.replace("https://", "");
      await fetch(
        `https://api.vercel.com/v11/now/deployments/get?url=${uriWithoutProtocol}&teamId=${process.env.VERCEL_TEAM_ID}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
          },
        },
      )
        .then((response) => {
          console.log(response.json());
          return true;
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    }
    return true;
  });

  console.log("filteredRedirectUris: ", filteredRedirectUris);
  console.log("=======================================================");

  // filteredRedirectUris.filter(async uri=>{

  //   await fetch(uri).then(data=> testTrueFalse => true false)
  // })
  // fetching vercel API for deployment alias url

  // const vercelDeploymentUrlWithoutProtocol = githubDeploymentStatus.target_url.replace(
  //   "https://",
  //   "",
  // );

  // const vercelDeploymentInfos = await fetch(
  //   `https://api.vercel.com/v11/now/deployments/get?url=${vercelDeploymentUrlWithoutProtocol}&teamId=${process.env.VERCEL_TEAM_ID}`,
  //   { headers: { Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}` } },
  // )
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .catch((errors) => {
  //     throw errors;
  //   });

  // console.log("vercelDeploymentInfos: ", vercelDeploymentInfos);
  // console.log("=======================================================");

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
