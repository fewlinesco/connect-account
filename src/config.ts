import OAuth2Client, {
  OAuth2ClientConstructor,
} from "@fewlines/connect-client";

type Config = {
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
  managementCredentials: {
    URI: string;
    APIKey: string;
  };
};

const config: Config = {
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
  managementCredentials: {
    URI: "",
    APIKey: "",
  },
};

function handleEnvVars(): void {
  const appHostname =
    process.env.CONNECT_ACCOUNT_HOSTNAME ||
    `${process.env.HEROKU_APP_NAME}.herokuapp.com`;
  config.connectAccountURL = appHostname ? `https://${appHostname}` : "";
  config.dynamoRegion = process.env.DYNAMODB_REGION || "";
  config.dynamoDbEndpoint = process.env.DYNAMODB_ENDPOINT || "";
  config.dynamoAccessKeyID = process.env.DYNAMODB_ACCESS_KEY_ID || "";
  config.dynamoSecretAccessKey = process.env.DYNAMODB_SECRET_ACCESS_KEY || "";
  config.dynamoTableName = process.env.DYNAMODB_TABLE_NAME || "";
  config.connectProviderUrl = process.env.CONNECT_PROVIDER_URL || "";
  config.connectApplicationClientId =
    process.env.CONNECT_APPLICATION_CLIENT_ID || "";
  config.connectApplicationClientSecret =
    process.env.CONNECT_APPLICATION_CLIENT_SECRET || "";
  config.connectApplicationScopes =
    process.env.CONNECT_APPLICATION_SCOPES || "";
  config.cookieSalt = process.env.CONNECT_ACCOUNT_SESSION_SALT || "";
  config.connectOpenIdConfigurationUrl =
    process.env.CONNECT_OPEN_ID_CONFIGURATION_URL || "";
  config.connectAccountRedirectURI = appHostname
    ? `https://${appHostname}/api/oauth/callback`
    : "";
  config.connectAudience = process.env.CONNECT_AUDIENCE || "";
  config.connectJwtAlgorithm = process.env.CONNECT_JWT_ALGORITHM || "";
  config.accountJwePrivateKey = process.env.ACCOUNT_JWE_PRIVATE_KEY || "";
  config.isJweSigned = process.env.IS_JWE_SIGNED || "";
  config.connectTestAccountEmail = process.env.CONNECT_TEST_ACCOUNT_EMAIL || "";
  config.connectTestAccountPassword =
    process.env.CONNECT_TEST_ACCOUNT_PASSWORD || "";
  config.serviceName = process.env.SERVICE_NAME || "Connect.Account";
  config.lightstepAccessToken = process.env.LIGHTSTEP_ACCESS_TOKEN || "";
  config.managementCredentials = {
    URI: process.env.CONNECT_MANAGEMENT_URL || "",
    APIKey: process.env.CONNECT_MANAGEMENT_API_KEY || "",
  };
}

handleEnvVars();

const oauth2ClientConstructorProps: OAuth2ClientConstructor = {
  openIDConfigurationURL: config.connectOpenIdConfigurationUrl,
  clientID: config.connectApplicationClientId,
  clientSecret: config.connectApplicationClientSecret,
  redirectURI: config.connectAccountRedirectURI,
  audience: config.connectAudience,
  scopes: config.connectApplicationScopes.split(" "),
};

const oauth2Client = new OAuth2Client(oauth2ClientConstructorProps);

export { config, oauth2Client };
