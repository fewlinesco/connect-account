import { execute, makePromise } from "apollo-link";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-link-http";
import fetch from "cross-fetch";
import gql from "graphql-tag";

function fetchManagement(operation) {
  const httpLink = new HttpLink({
    uri: process.env.CONNECT_MANAGEMENT_URL,
    fetch,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `API_KEY ${process.env.CONNECT_MANAGEMENT_API_KEY}`,
      },
    };
  });

  return makePromise(execute(authLink.concat(httpLink), operation));
}

const UPDATE_APPLICATION_MUTATION = gql`
  mutation updateApplication(
    $id: String!
    $description: String!
    $name: String!
    $redirectUris: [String]!
    $defaultHomePage: String!
  ) {
    updateApplication(
      input: {
        id: $id
        description: $description
        name: $name
        redirectUris: $redirectUris
        defaultHomePage: $defaultHomePage
      }
    ) {
      id
      description
      redirectUris
      name
      defaultHomePage
    }
  }
`;

function updateApplication(command) {
  const operation = {
    query: UPDATE_APPLICATION_MUTATION,
    variables: command,
  };

  return fetchManagement(operation);
}

const GET_APPLICATION_QUERY = gql`
  query getApplicationQuery($id: String!) {
    provider {
      application(filters: { id: $id }) {
        id
        defaultHomePage
        redirectUris
        name
        description
      }
    }
  }
`;

function getApplication(id) {
  const operation = {
    query: GET_APPLICATION_QUERY,
    variables: { id },
  };

  return fetchManagement(operation);
}

async function removeHerokuRedirectURIFromConnect() {
  if (process.env.CONNECT_ACCOUNT_TEST_APP_ID === undefined) {
    throw new Error(
      "CONNECT_ACCOUNT_TEST_APP_ID environment variable is undefined",
    );
  }

  if (process.env.HEROKU_APP_NAME === undefined) {
    throw new Error("HEROKU_APP_NAME environment variable is undefined");
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

  const herokuDeploymentUrl =
    "https://" +
    process.env.HEROKU_APP_NAME +
    ".herokuapp.com" +
    "/api/oauth/callback/";

  const updatedTestApp = {
    ...testApp,
    redirectUris: testApp.redirectUris.filter(
      (uri) => uri !== herokuDeploymentUrl,
    ),
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

removeHerokuRedirectURIFromConnect();
