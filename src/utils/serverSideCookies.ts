import { seal, defaults, unseal } from "@hapi/iron";
import Cookies from "cookies";
import { IncomingMessage, ServerResponse } from "http";

import { config } from "@src/config";

export async function setServerSideCookies(
  request: IncomingMessage,
  response: ServerResponse,
  cookieName: string,
  cookieValue: string,
  shouldCookieBeSealed: boolean,
): Promise<void> {
  const cookies = new Cookies(request, response);

  if (shouldCookieBeSealed) {
    const sealedCookieValue = await seal(
      cookieValue,
      config.connectAccountSessionSalt,
      defaults,
    );

    cookies.set(cookieName, sealedCookieValue);
  } else {
    cookies.set(cookieName, cookieValue);
  }
}

export async function getServerSideCookies(
  request: IncomingMessage,
  response: ServerResponse,
  cookieName: string,
  isCookieSealed: boolean,
): Promise<string | undefined> {
  const cookies = new Cookies(request, response);

  if (isCookieSealed) {
    const sealedCookie = cookies.get(cookieName);

    if (sealedCookie) {
      return unseal(sealedCookie, config.connectAccountSessionSalt);
    } else {
      return undefined;
    }
  } else {
    return cookies.get(cookieName);
  }
}
