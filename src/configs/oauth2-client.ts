import OAuth2Client, {
  OAuth2ClientConstructor,
} from "@fewlines/connect-client";

import { config } from "@src/configs/config-variables";

const oauth2ClientConstructorProps: OAuth2ClientConstructor = {
  openIDConfigurationURL: config.connectOpenIdConfigurationUrl,
  clientID: config.connectApplicationClientId,
  clientSecret: config.connectApplicationClientSecret,
  redirectURI: config.connectAccountRedirectURI,
  audience: config.connectAudience,
  scopes: config.connectApplicationScopes.split(" "),
};

const oauth2Client = new OAuth2Client(oauth2ClientConstructorProps);

export { oauth2Client };
