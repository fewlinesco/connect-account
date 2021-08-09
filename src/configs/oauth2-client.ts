import OAuth2Client, {
  OAuth2ClientConstructor,
} from "@fewlines/connect-client";

import { CONFIG_VARIABLES } from "@src/configs/config-variables";

const oauth2ClientConstructorProps: OAuth2ClientConstructor = {
  openIDConfigurationURL: CONFIG_VARIABLES.connectOpenIdConfigurationUrl,
  clientID: CONFIG_VARIABLES.connectApplicationClientId,
  clientSecret: CONFIG_VARIABLES.connectApplicationClientSecret,
  redirectURI: CONFIG_VARIABLES.connectAccountRedirectURI,
  audience: CONFIG_VARIABLES.connectAudience,
  scopes: CONFIG_VARIABLES.connectApplicationScopes.split(" "),
};

const oauth2Client = new OAuth2Client(oauth2ClientConstructorProps);

export { oauth2Client };
