import OAuth2Client, { OAuth2ClientConstructor } from "@fwl/oauth2";

type Config = {
  connectDomain: string;
  connectManagementUrl: string;
  connectMongoUrl: string;
  connectMongoDbName: string;
  connectManagementApiKey: string;
  connectProviderUrl: string;
  connectApplicationClientId: string;
  connectApplicationClientSecret: string;
  connectApplicationScopes: string;
  connectAccountSessionSalt: string;
  connectOpenIdConfigurationUrl: string;
  connectRedirectUri: string;
  connectAudience: string;
  connectJwtAlgorithm: string;
};

const config: Config = {
  connectDomain: "",
  connectManagementUrl: "",
  connectMongoUrl: "",
  connectMongoDbName: "",
  connectManagementApiKey: "",
  connectProviderUrl: "",
  connectApplicationClientId: "",
  connectApplicationClientSecret: "",
  connectApplicationScopes: "",
  connectAccountSessionSalt: "",
  connectOpenIdConfigurationUrl: "",
  connectRedirectUri: "",
  connectAudience: "",
  connectJwtAlgorithm: "",
};

function handleEnvVars(): void {
  config.connectDomain = process.env.CONNECT_ACCOUNT_DOMAIN || "";
  config.connectManagementUrl = process.env.CONNECT_MANAGEMENT_URL || "";
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
  config.connectRedirectUri = process.env.CONNECT_REDIRECT_URI || "";
  config.connectAudience = process.env.CONNECT_AUDIENCE || "";
  config.connectJwtAlgorithm = process.env.CONNECT_JWT_ALGORITHM || "";
}

handleEnvVars();

const oauth2ClientConstructorProps: OAuth2ClientConstructor = {
  openIDConfigurationURL: config.connectOpenIdConfigurationUrl,
  clientID: config.connectApplicationClientId,
  clientSecret: config.connectApplicationClientSecret,
  redirectURI: config.connectRedirectUri,
  audience: config.connectAudience,
  scopes: config.connectApplicationScopes.split(" "),
};

const oauth2Client = new OAuth2Client(oauth2ClientConstructorProps);

export { config, oauth2Client };
