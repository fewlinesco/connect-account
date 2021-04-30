import { UnreachableError } from "@fewlines/connect-client";

import { oauth2Client } from "@src/configs/oauth2-client";
import { MissingConnectProfileScopes } from "@src/errors/errors";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";

type ProfileUserInfo = {
  _claim_sources: {
    profile_provider: { access_token: string; endpoint: string };
  };
};

async function getProfileAccessToken(accessToken: string): Promise<string> {
  const webErrors = {
    unreachable: ERRORS_DATA.UNREACHABLE,
  };

  const profileAccessToken = await oauth2Client
    .getUserInfo<ProfileUserInfo>(accessToken)
    .then((userInfoData) => {
      if (!userInfoData._claim_sources) {
        throw new MissingConnectProfileScopes();
      }

      return userInfoData._claim_sources.profile_provider.access_token;
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

  return profileAccessToken;
}

export { getProfileAccessToken };
