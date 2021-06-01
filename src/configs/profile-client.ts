import { Span } from "@fwl/tracing";
import { getServerSideCookies } from "@fwl/web";
import { NextApiRequest } from "next";

import { Configuration, ConnectProfileApi } from "../../connect-profile-client";
import { configVariables } from "./config-variables";
import { UserCookie } from "@src/@types/user-cookie";
import { NoUserCookieFoundError } from "@src/errors/errors";
import { getProfileAndAddressAccessTokens } from "@src/utils/get-profile-and-address-access-tokens";

async function initProfileClient(
  request: NextApiRequest,
  span: Span,
): Promise<{
  userProfileClient: ConnectProfileApi;
  userAddressClient: ConnectProfileApi;
}> {
  const userCookie = await getServerSideCookies<UserCookie>(request, {
    cookieName: "user-cookie",
    isCookieSealed: true,
    cookieSalt: configVariables.cookieSalt,
  });

  if (!userCookie) {
    throw new NoUserCookieFoundError();
  }

  const { profileAccessToken, addressAccessToken } =
    await getProfileAndAddressAccessTokens(userCookie.access_token);

  span.setDisclosedAttribute("is Connect.Profile access token available", true);

  const userProfileClient = new ConnectProfileApi(
    new Configuration({
      accessToken: profileAccessToken,
      basePath: configVariables.connectProfileUrl,
    }),
  );

  const userAddressClient = new ConnectProfileApi(
    new Configuration({
      accessToken: addressAccessToken,
      basePath: configVariables.connectProfileUrl,
    }),
  );

  return { userProfileClient, userAddressClient };
}

export { initProfileClient };
