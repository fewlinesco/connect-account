import { seal, defaults, unseal } from "@hapi/iron";
import Cookies from "cookies";
import { IncomingMessage, ServerResponse } from "http";

import { config } from "@src/config";

export async function setServerSideCookies(
  request: IncomingMessage,
  response: ServerResponse,
  cookieName: string,
  cookieValue: unknown,
  options: { shouldCookieBeSealed: boolean } & Cookies.SetOption,
): Promise<void> {
  const cookies = new Cookies(request, response);
  const { shouldCookieBeSealed, ...setOptions } = options;

  if (shouldCookieBeSealed) {
    const sealedCookieValue = await seal(
      JSON.stringify(cookieValue),
      config.connectAccountSessionSalt,
      defaults,
    );

    cookies.set(cookieName, sealedCookieValue, setOptions);
  } else {
    cookies.set(cookieName, JSON.stringify(cookieValue), setOptions);
  }
}

export async function getServerSideCookies<T = unknown>(
  request: IncomingMessage,
  response: ServerResponse,
  cookieName: string,
  isCookieSealed: boolean,
): Promise<T | undefined> {
  const cookies = new Cookies(request, response);

  if (isCookieSealed) {
    const sealedCookie = cookies.get(cookieName);

    if (sealedCookie) {
      const unsealedCookie = await unseal(
        sealedCookie,
        config.connectAccountSessionSalt,
        defaults,
      );
      return JSON.parse(unsealedCookie);
    } else {
      return undefined;
    }
  } else {
    const cookie = cookies.get(cookieName);

    if (cookie) {
      return JSON.parse(cookie);
    } else {
      return undefined;
    }
  }
}

// http only ? to remove explicit boolean
