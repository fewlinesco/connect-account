import { Configuration, ConnectProfileApi } from "../../connect-profile-client";
import { configVariables } from "./config-variables";

function initProfileClient(accessToken: string): ConnectProfileApi {
  return new ConnectProfileApi(
    new Configuration({
      accessToken,
      basePath: configVariables.profileMockServerUrl,
    }),
  );
}

export { initProfileClient };
