import { Config, configDefaults } from "@fewlines/fwl-config";

import * as appConfig from "../config.json";

interface AccountConfig extends Config {
  connectManagement: {
    apiKey: string;
    graphqlEndpoint: string;
  };
  connectProfile: {
    apiKey: string;
  }
}

const config: AccountConfig = { ...configDefaults, ...appConfig };

export default config;
