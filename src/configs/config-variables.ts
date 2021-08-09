import { TracingConfig } from "@fwl/tracing";

type ConfigVariables = {
  featureFlag: string;
  connectAccountURL: string;
  dynamoRegion: string;
  dynamoDbEndpoint: string;
  dynamoAccessKeyID: string;
  dynamoSecretAccessKey: string;
  dynamoTableName: string;
  connectProviderUrl: string;
  connectApplicationClientId: string;
  connectApplicationClientSecret: string;
  connectApplicationScopes: string;
  cookieSalt: string;
  connectOpenIdConfigurationUrl: string;
  connectAccountRedirectURI: string;
  connectAudience: string;
  connectJwtAlgorithm: string;
  accountJwePrivateKey: string;
  isJweSigned: string;
  connectTestAccountEmail: string;
  connectTestAccountPassword: string;
  serviceName: string;
  lightstepAccessToken: string;
  fwlTracingCollectors: TracingConfig["collectors"];
  managementCredentials: {
    URI: string;
    APIKey: string;
  };
  connectProfileUrl: string;
};

const CONFIG_VARIABLES: ConfigVariables = {
  featureFlag: "",
  connectAccountURL: "",
  dynamoRegion: "",
  dynamoDbEndpoint: "",
  dynamoAccessKeyID: "",
  dynamoSecretAccessKey: "",
  dynamoTableName: "",
  connectProviderUrl: "",
  connectApplicationClientId: "",
  connectApplicationClientSecret: "",
  connectApplicationScopes: "",
  cookieSalt: "",
  connectOpenIdConfigurationUrl: "",
  connectAccountRedirectURI: "",
  connectAudience: "",
  connectJwtAlgorithm: "",
  accountJwePrivateKey: "",
  isJweSigned: "",
  connectTestAccountEmail: "",
  connectTestAccountPassword: "",
  serviceName: "",
  lightstepAccessToken: "",
  fwlTracingCollectors: [],
  managementCredentials: {
    URI: "",
    APIKey: "",
  },
  connectProfileUrl: "",
};

function getConnectAccountURL(): string {
  if (process.env.CONNECT_ACCOUNT_HOSTNAME) {
    return `https://${process.env.CONNECT_ACCOUNT_HOSTNAME}/`;
  }

  if (process.env.HEROKU_APP_NAME) {
    return `https://${process.env.HEROKU_APP_NAME}.herokuapp.com/`;
  }

  return "https://connect-account.local:29704/";
}

function handleEnvVars(): void {
  CONFIG_VARIABLES.featureFlag =
    process.env.NEXT_PUBLIC_FEATURE_FLAG || process.env.NODE_ENV === "test"
      ? "false"
      : "";
  CONFIG_VARIABLES.connectAccountURL = getConnectAccountURL();
  CONFIG_VARIABLES.dynamoRegion = process.env.DYNAMODB_REGION || "";
  CONFIG_VARIABLES.dynamoDbEndpoint = process.env.DYNAMODB_ENDPOINT || "";
  CONFIG_VARIABLES.dynamoAccessKeyID = process.env.DYNAMODB_ACCESS_KEY_ID || "";
  CONFIG_VARIABLES.dynamoSecretAccessKey =
    process.env.DYNAMODB_SECRET_ACCESS_KEY || "";
  CONFIG_VARIABLES.dynamoTableName = process.env.DYNAMODB_TABLE_NAME || "";
  CONFIG_VARIABLES.connectProviderUrl = process.env.CONNECT_PROVIDER_URL || "";
  CONFIG_VARIABLES.connectApplicationClientId =
    process.env.CONNECT_APPLICATION_CLIENT_ID || "";
  CONFIG_VARIABLES.connectApplicationClientSecret =
    process.env.CONNECT_APPLICATION_CLIENT_SECRET || "";
  CONFIG_VARIABLES.connectApplicationScopes =
    process.env.CONNECT_APPLICATION_SCOPES || "";
  CONFIG_VARIABLES.cookieSalt = process.env.CONNECT_ACCOUNT_SESSION_SALT || "";
  CONFIG_VARIABLES.connectOpenIdConfigurationUrl =
    process.env.CONNECT_OPEN_ID_CONFIGURATION_URL || "";
  CONFIG_VARIABLES.connectAccountRedirectURI = `${getConnectAccountURL()}api/oauth/callback/`;
  CONFIG_VARIABLES.connectAudience = process.env.CONNECT_AUDIENCE || "";
  CONFIG_VARIABLES.connectJwtAlgorithm =
    process.env.CONNECT_JWT_ALGORITHM || "";
  CONFIG_VARIABLES.accountJwePrivateKey =
    process.env.ACCOUNT_JWE_PRIVATE_KEY || "";
  CONFIG_VARIABLES.isJweSigned = process.env.IS_JWE_SIGNED || "";
  CONFIG_VARIABLES.connectTestAccountEmail =
    process.env.CONNECT_TEST_ACCOUNT_EMAIL || "";
  CONFIG_VARIABLES.connectTestAccountPassword =
    process.env.CONNECT_TEST_ACCOUNT_PASSWORD || "";
  CONFIG_VARIABLES.serviceName = process.env.SERVICE_NAME || "Connect.Account";
  CONFIG_VARIABLES.lightstepAccessToken =
    process.env.LIGHTSTEP_ACCESS_TOKEN || "";
  CONFIG_VARIABLES.managementCredentials = {
    URI: process.env.CONNECT_MANAGEMENT_URL || "",
    APIKey: process.env.CONNECT_MANAGEMENT_API_KEY || "",
  };
  CONFIG_VARIABLES.connectProfileUrl = process.env.CONNECT_PROFILE_URL || "";

  if (process.env.FWL_TRACING_COLLECTORS) {
    CONFIG_VARIABLES.fwlTracingCollectors = JSON.parse(
      process.env.FWL_TRACING_COLLECTORS,
    );
  }
}

handleEnvVars();

export { CONFIG_VARIABLES };
