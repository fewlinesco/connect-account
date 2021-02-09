import { seal, defaults, unseal } from "@hapi/iron";
import cookie from "cookie";
import { IncomingMessage, ServerResponse } from "http";

import { config } from "@src/config";

export async function setServerSideCookies(
  response: ServerResponse,
  cookieName: string,
  cookieValue: string | Record<string, unknown>,
  options: { shouldCookieBeSealed: boolean } & cookie.CookieSerializeOptions,
): Promise<void> {
  const { shouldCookieBeSealed, ...setCookieOptions } = options;

  if (shouldCookieBeSealed) {
    const sealedCookieValue = await seal(
      JSON.stringify(cookieValue),
      config.cookieSalt,
      defaults,
    );

    response.setHeader(
      "Set-Cookie",
      cookie.serialize(cookieName, sealedCookieValue, setCookieOptions),
    );
  } else {
    response.setHeader(
      "Set-Cookie",
      cookie.serialize(
        cookieName,
        JSON.stringify(cookieValue),
        setCookieOptions,
      ),
    );
  }
}

export async function getServerSideCookies<T = unknown>(
  request: IncomingMessage,
  cookieParams: {
    cookieName: string;
    isCookieSealed: boolean;
  },
): Promise<T | undefined> {
  const { cookieName, isCookieSealed } = cookieParams;
  const cookies = cookie.parse(request.headers.cookie || "");
  const targetedCookie = cookies[cookieName];

  if (!targetedCookie) {
    return undefined;
  }

  if (isCookieSealed) {
    const unsealedCookie = await unseal(
      targetedCookie,
      config.cookieSalt,
      defaults,
    );

    return JSON.parse(unsealedCookie);
  }

  return JSON.parse(targetedCookie);
}
