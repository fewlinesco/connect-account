import { UnreachableError } from "@fewlines/connect-client";

import { oauth2Client } from "@src/configs/oauth2-client";
import { MissingConnectProfileScopes } from "@src/errors/errors";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";

type ProfileAddressUserInfo = {
  _claim_sources: {
    profile_provider: { access_token: string; endpoint: string };
    address_provider: { access_token: string; endpoint: string };
  };
};

async function getProfileAndAddressAccessTokens(
  accessToken: string,
): Promise<{ profileAccessToken: string; addressAccessToken: string }> {
  const webErrors = {
    unreachable: ERRORS_DATA.UNREACHABLE,
  };

  return await oauth2Client
    .getUserInfo<ProfileAddressUserInfo>(accessToken)
    .then((userInfoData) => {
      if (!userInfoData._claim_sources) {
        throw new MissingConnectProfileScopes();
      }

      const { profile_provider, address_provider } =
        userInfoData._claim_sources;

      return {
        profileAccessToken: profile_provider.access_token,
        addressAccessToken: address_provider.access_token,
      };
    })
    .catch((error) => {
      if (error instanceof UnreachableError) {
        throw webErrorFactory({
          ...webErrors.unreachable,
          parentError: error,
        });
      }

      throw error;
    });
}

export { getProfileAndAddressAccessTokens };
