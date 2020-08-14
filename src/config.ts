type Config = {
  connectManagementUrl: string;
  connectManagementApiKey: string;
  connectProviderUrl: string;
  connectApplicationClientId: string;
  connectApplicationClientSecret: string;
  connectApplicationScopes: string;
  connectAccountSessionSalt: string;
  connectAccountPublicSentryDSN: string;
};

const config: Config = {
  connectManagementUrl: "",
  connectManagementApiKey: "",
  connectProviderUrl: "",
  connectApplicationClientId: "",
  connectApplicationClientSecret: "",
  connectApplicationScopes: "",
  connectAccountSessionSalt: "",
  connectAccountPublicSentryDSN: "",
};

function handleEnvVars(): void {
  if (!process.env.CONNECT_MANAGEMENT_URL) {
    console.log("Missing CONNECT_MANAGEMENT_URL");
    process.exit(1);
  }
  config.connectManagementUrl = process.env.CONNECT_MANAGEMENT_URL;

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

  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.log("Missing NEXT_PUBLIC_SENTRY_DSN");
    process.exit(1);
  }
}

handleEnvVars();

export { config };
