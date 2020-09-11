import OAuth2Client, { OAuth2ClientConstructor } from "@fwl/oauth2";
import { MongoClient } from "mongodb";

type Config = {
  connectDomain: string;
  connectManagementUrl: string;
  connectMongoUrl: string;
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
  if (!process.env.CONNECT_ACCOUNT_DOMAIN) {
    console.log("Missing CONNECT_ACCOUNT_DOMAIN");
    process.exit(1);
  }
  config.connectDomain = process.env.CONNECT_ACCOUNT_DOMAIN;

  if (!process.env.CONNECT_MANAGEMENT_URL) {
    console.log("Missing CONNECT_MANAGEMENT_URL");
    process.exit(1);
  }
  config.connectManagementUrl = process.env.CONNECT_MANAGEMENT_URL;

  if (!process.env.MONGO_URL) {
    console.log("Missing MONGO_URL");
    process.exit(1);
  }
  config.connectMongoUrl = process.env.MONGO_URL;

  if (!process.env.CONNECT_MANAGEMENT_API_KEY) {
    console.log("Missing CONNECT_MANAGEMENT_API_KEY");
    process.exit(1);
  }
  config.connectManagementApiKey = process.env.CONNECT_MANAGEMENT_API_KEY;

  if (!process.env.CONNECT_PROVIDER_URL) {
    console.log("Missing CONNECT_PROVIDER_URL");
    process.exit(1);
  }
  config.connectProviderUrl = process.env.CONNECT_PROVIDER_URL;

  if (!process.env.CONNECT_APPLICATION_CLIENT_ID) {
    console.log("Missing CONNECT_APPLICATION_CLIENT_ID");
    process.exit(1);
  }
  config.connectApplicationClientId = process.env.CONNECT_APPLICATION_CLIENT_ID;

  if (!process.env.CONNECT_APPLICATION_CLIENT_SECRET) {
    console.log("Missing CONNECT_APPLICATION_CLIENT_SECRET");
    process.exit(1);
  }
  config.connectApplicationClientSecret =
    process.env.CONNECT_APPLICATION_CLIENT_SECRET;

  if (!process.env.CONNECT_APPLICATION_SCOPES) {
    console.log("Missing CONNECT_APPLICATION_SCOPES");
    process.exit(1);
  }
  config.connectApplicationScopes = process.env.CONNECT_APPLICATION_SCOPES;

  if (!process.env.CONNECT_ACCOUNT_SESSION_SALT) {
    console.log("Missing CONNECT_ACCOUNT_SESSION_SALT");
    process.exit(1);
  }
  config.connectAccountSessionSalt = process.env.CONNECT_ACCOUNT_SESSION_SALT;

  if (!process.env.CONNECT_OPEN_ID_CONFIGURATION_URL) {
    console.log("Missing CONNECT_OPEN_ID_CONFIGURATION_URL");
    process.exit(1);
  }
  config.connectOpenIdConfigurationUrl =
    process.env.CONNECT_OPEN_ID_CONFIGURATION_URL;

  if (!process.env.CONNECT_REDIRECT_URI) {
    console.log("Missing CONNECT_REDIRECT_URI");
    process.exit(1);
  }
  config.connectRedirectUri = process.env.CONNECT_REDIRECT_URI;

  if (!process.env.CONNECT_AUDIENCE) {
    console.log("Missing CONNECT_AUDIENCE");
    process.exit(1);
  }
  config.connectAudience = process.env.CONNECT_AUDIENCE;

  if (!process.env.CONNECT_JWT_ALGORITHM) {
    console.log("Missing CONNECT_JWT_ALGORITHM");
    process.exit(1);
  }
  config.connectJwtAlgorithm = process.env.CONNECT_JWT_ALGORITHM;

  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.log("Missing NEXT_PUBLIC_SENTRY_DSN");
    process.exit(1);
  }
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

const mongoClient = new MongoClient(config.connectMongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export { config, oauth2Client, mongoClient };
