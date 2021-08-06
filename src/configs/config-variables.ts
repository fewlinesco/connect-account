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

const configVariables: ConfigVariables = {
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
  const connectAccountURL = getConnectAccountURL();

  configVariables.featureFlag =
    process.env.NEXT_PUBLIC_FEATURE_FLAG || process.env.NODE_ENV === "test"
      ? "false"
      : "";
  configVariables.connectAccountURL = connectAccountURL;
  configVariables.dynamoRegion = process.env.DYNAMODB_REGION || "";
  configVariables.dynamoDbEndpoint = process.env.DYNAMODB_ENDPOINT || "";
  configVariables.dynamoAccessKeyID = process.env.DYNAMODB_ACCESS_KEY_ID || "";
  configVariables.dynamoSecretAccessKey =
    process.env.DYNAMODB_SECRET_ACCESS_KEY || "";
  configVariables.dynamoTableName = process.env.DYNAMODB_TABLE_NAME || "";
  configVariables.connectProviderUrl = process.env.CONNECT_PROVIDER_URL || "";
  configVariables.connectApplicationClientId =
    process.env.CONNECT_APPLICATION_CLIENT_ID || "";
  configVariables.connectApplicationClientSecret =
    process.env.CONNECT_APPLICATION_CLIENT_SECRET || "";
  configVariables.connectApplicationScopes =
    process.env.CONNECT_APPLICATION_SCOPES || "";
  configVariables.cookieSalt = process.env.CONNECT_ACCOUNT_SESSION_SALT || "";
  configVariables.connectOpenIdConfigurationUrl =
    process.env.CONNECT_OPEN_ID_CONFIGURATION_URL || "";
  configVariables.connectAccountRedirectURI = `${connectAccountURL}api/oauth/callback/`;
  configVariables.connectAudience = process.env.CONNECT_AUDIENCE || "";
  configVariables.connectJwtAlgorithm = process.env.CONNECT_JWT_ALGORITHM || "";
  configVariables.accountJwePrivateKey =
    process.env.ACCOUNT_JWE_PRIVATE_KEY || "";
  configVariables.isJweSigned = process.env.IS_JWE_SIGNED || "";
  configVariables.connectTestAccountEmail =
    process.env.CONNECT_TEST_ACCOUNT_EMAIL || "";
  configVariables.connectTestAccountPassword =
    process.env.CONNECT_TEST_ACCOUNT_PASSWORD || "";
  configVariables.serviceName = process.env.SERVICE_NAME || "Connect.Account";
  configVariables.lightstepAccessToken =
    process.env.LIGHTSTEP_ACCESS_TOKEN || "";
  if (process.env.FWL_TRACING_COLLECTORS) {
    configVariables.fwlTracingCollectors = JSON.parse(
      process.env.FWL_TRACING_COLLECTORS,
    );
  }
  configVariables.managementCredentials = {
    URI: process.env.CONNECT_MANAGEMENT_URL || "",
    APIKey: process.env.CONNECT_MANAGEMENT_API_KEY || "",
  };
  configVariables.connectProfileUrl = process.env.CONNECT_PROFILE_URL || "";
}

handleEnvVars();

export { configVariables };
