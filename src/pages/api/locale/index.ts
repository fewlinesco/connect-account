import {
  Endpoint,
  getServerSideCookies,
  HttpStatus,
  setAlertMessagesCookie,
  setServerSideCookies,
} from "@fwl/web";
import { wrapMiddlewares, Middleware } from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { UserCookie } from "@src/@types/user-cookie";
import { CONFIG_VARIABLES } from "@src/configs/config-variables";
import { formatAlertMessage, getLocaleFromRequest } from "@src/configs/intl";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { NoUserCookieFoundError } from "@src/errors/errors";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";
import { generateAlertMessage } from "@src/utils/generate-alert-message";
import { AVAILABLE_LANGUAGE } from "@src/utils/get-locale";

const getHandler: Handler = (request, response): Promise<void> => {
  return getTracer().span("get-locale handler", async (span) => {
    const userCookie = await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
      cookieSalt: CONFIG_VARIABLES.cookieSalt,
    });

    if (!userCookie) {
      span.setDisclosedAttribute("user cookie found", false);
      throw new NoUserCookieFoundError();
    }
    span.setDisclosedAttribute("user cookie found", true);

    const locale = getLocaleFromRequest(request, span);
    response.statusCode = HttpStatus.OK;
    response.json(JSON.stringify(locale));
    return;
  });
};

const patchHandler: Handler = (request, response): Promise<void> => {
  const webErrors = {
    badRequest: ERRORS_DATA.BAD_REQUEST,
  };

  return getTracer().span("set-locale handler", async (span) => {
    const userCookie = await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
      cookieSalt: CONFIG_VARIABLES.cookieSalt,
    });

    if (!userCookie) {
      span.setDisclosedAttribute("user cookie found", false);
      throw new NoUserCookieFoundError();
    }
    span.setDisclosedAttribute("user cookie found", true);

    const { locale } = request.body;

    if (!locale) {
      throw webErrorFactory(webErrors.badRequest);
    }

    setAlertMessagesCookie(response, [
      generateAlertMessage(
        `${formatAlertMessage(locale, "localeChanged")} ${
          AVAILABLE_LANGUAGE[locale]
        }`,
      ),
    ]);

    setServerSideCookies(response, "NEXT_LOCALE", locale, {
      shouldCookieBeSealed: false,
      maxAge: 2147483647,
      path: "/",
    });

    span.setDisclosedAttribute("user locale set", true);
    response.statusCode = HttpStatus.OK;
    response.setHeader("Content-Type", "application/json");
    return response.end();
  });
};

const middlewares: Middleware<NextApiRequest, NextApiResponse>[] =
  basicMiddlewares(getTracer(), logger);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrapMiddlewares(middlewares, getHandler, "GET /api/locale/"))
  .patch(wrapMiddlewares(middlewares, patchHandler, "POST /api/locale/"))
  .getHandler();
