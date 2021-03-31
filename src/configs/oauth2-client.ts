import OAuth2Client, {
  OAuth2ClientConstructor,
} from "@fewlines/connect-client";

import { configVariables } from "@src/configs/config-variables";

const oauth2ClientConstructorProps: OAuth2ClientConstructor = {
  openIDConfigurationURL: configVariables.connectOpenIdConfigurationUrl,
  clientID: configVariables.connectApplicationClientId,
  clientSecret: configVariables.connectApplicationClientSecret,
  redirectURI: configVariables.connectAccountRedirectURI,
  audience: configVariables.connectAudience,
  scopes: configVariables.connectApplicationScopes.split(" "),
};

const oauth2Client = new OAuth2Client(oauth2ClientConstructorProps);

export { oauth2Client };
