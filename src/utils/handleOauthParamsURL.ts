import { GetServerSidePropsContext } from "next";

import { config } from "../config";

export async function handleOauthParamsURL(
  context: GetServerSidePropsContext,
): Promise<URL> {
  const protocol =
    process.env.NODE_ENV === "production" ? "https://" : "http://";
  const host = context.req.headers.host;
  const route = "/api/oauth/callback";
  const redirect_uri = protocol + host + route;

  const authorizeURL = new URL("/oauth/authorize", config.connectProviderUrl);
  authorizeURL.searchParams.append(
    "client_id",
    config.connectApplicationClientId,
  );
  authorizeURL.searchParams.append("response_type", "code");
  authorizeURL.searchParams.append("redirect_uri", redirect_uri);
  authorizeURL.searchParams.append("scope", config.connectApplicationScopes);

  return authorizeURL;
}
