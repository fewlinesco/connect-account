import OAuth2Client, { OAuth2ClientConstructor } from "@fwl/oauth2";

type Config = {
  connectAccountURL: string;
  connectAccountTheme: string;
  connectManagementUrl: string;
  dynamoDbRegion: string;
  dynamoDbEndpoint: string;
  connectMongoUrl: string;
  connectMongoDbName: string;
  connectManagementApiKey: string;
  connectProviderUrl: string;
  connectApplicationClientId: string;
  connectApplicationClientSecret: string;
  connectApplicationScopes: string;
  connectAccountSessionSalt: string;
  connectOpenIdConfigurationUrl: string;
  connectAccountRedirectURI: string;
  connectAudience: string;
  connectJwtAlgorithm: string;
  connectTestAccountEmail: string;
  connectTestAccountPassword: string;
  connectAccountTestAppId: string;
};

const config: Config = {
  connectAccountURL: "",
  connectAccountTheme: "",
  connectManagementUrl: "",
  dynamoDbRegion: "",
  dynamoDbEndpoint: "",
  connectMongoUrl: "",
  connectMongoDbName: "",
  connectManagementApiKey: "",
  connectProviderUrl: "",
  connectApplicationClientId: "",
  connectApplicationClientSecret: "",
  connectApplicationScopes: "",
  connectAccountSessionSalt: "",
  connectOpenIdConfigurationUrl: "",
  connectAccountRedirectURI: "",
  connectAudience: "",
  connectJwtAlgorithm: "",
  connectTestAccountEmail: "",
  connectTestAccountPassword: "",
  connectAccountTestAppId: "",
};

function handleEnvVars(): void {
  const appHostname =
    process.env.VERCEL_URL || process.env.CONNECT_ACCOUNT_HOSTNAME;

  config.connectAccountURL = appHostname ? `https://${appHostname}` : "";
  config.connectAccountTheme = process.env.CONNECT_ACCOUNT_THEME || "fewlines";
  config.connectManagementUrl = process.env.CONNECT_MANAGEMENT_URL || "";
  config.dynamoDbRegion = process.env.DYNAMODB_REGION || "";
  config.dynamoDbEndpoint = process.env.DYNAMODB_ENDPOINT || "";
  config.connectMongoUrl = process.env.MONGO_URL || "";
  config.connectMongoDbName = process.env.MONGO_DB_NAME || "";
  config.connectManagementApiKey = process.env.CONNECT_MANAGEMENT_API_KEY || "";
  config.connectProviderUrl = process.env.CONNECT_PROVIDER_URL || "";
  config.connectApplicationClientId =
    process.env.CONNECT_APPLICATION_CLIENT_ID || "";
  config.connectApplicationClientSecret =
    process.env.CONNECT_APPLICATION_CLIENT_SECRET || "";
  config.connectApplicationScopes =
    process.env.CONNECT_APPLICATION_SCOPES || "";
  config.connectAccountSessionSalt =
    process.env.CONNECT_ACCOUNT_SESSION_SALT || "";
  config.connectOpenIdConfigurationUrl =
    process.env.CONNECT_OPEN_ID_CONFIGURATION_URL || "";
  config.connectAccountRedirectURI = appHostname
    ? `https://${appHostname}/api/oauth/callback`
    : "";
  config.connectAudience = process.env.CONNECT_AUDIENCE || "";
  config.connectJwtAlgorithm = process.env.CONNECT_JWT_ALGORITHM || "";
  config.connectTestAccountEmail = process.env.CONNECT_TEST_ACCOUNT_EMAIL || "";
  config.connectTestAccountPassword =
    process.env.CONNECT_TEST_ACCOUNT_PASSWORD || "";
  config.connectAccountTestAppId =
    process.env.CONNECT_ACCOUNT_TEST_APP_ID || "";
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
