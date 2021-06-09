import { Endpoint, getServerSideCookies, HttpStatus } from "@fwl/web";
import {
  loggingMiddleware,
  wrapMiddlewares,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
  rateLimitingMiddleware,
} from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { UserCookie } from "@src/@types/user-cookie";
import { configVariables } from "@src/configs/config-variables";
import { logger } from "@src/configs/logger";
import rateLimitingConfig from "@src/configs/rate-limiting-config";
import getTracer from "@src/configs/tracer";
import { NoUserCookieFoundError } from "@src/errors/errors";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";

const handler: Handler = (request, response): Promise<void> => {
  const webErrors = {
    databaseUnreachable: ERRORS_DATA.DATABASE_UNREACHABLE,
  };

  return getTracer().span("get-locale handler", async (span) => {
    const userCookie = await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
      cookieSalt: configVariables.cookieSalt,
    });

    if (!userCookie) {
      span.setDisclosedAttribute("user cookie found", false);
      throw new NoUserCookieFoundError();
    }
    span.setDisclosedAttribute("user cookie found", true);

    const currentDBUser = await getDBUserFromSub(userCookie.sub).catch(
      (error) => {
        span.setDisclosedAttribute("user locale retrieved", false);
        throw webErrorFactory({
          ...webErrors.databaseUnreachable,
          parentError: error,
        });
      },
    );

    if (!currentDBUser) {
      span.setDisclosedAttribute("user locale value", null);
      response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      response.setHeader("location", "/");
      response.end();
      return;
    }

    // const locale = currentDBUser.locale;
    span.setDisclosedAttribute("user locale retrieved", currentDBUser.locale);
    response.statusCode = HttpStatus.OK;
    response.json({ locale: currentDBUser.locale });
    return;
  });
};

const wrappedHandler = wrapMiddlewares(
  [
    tracingMiddleware(getTracer()),
    rateLimitingMiddleware(getTracer(), logger, rateLimitingConfig),
    recoveryMiddleware(getTracer()),
    sentryMiddleware(getTracer()),
    errorMiddleware(getTracer()),
    loggingMiddleware(getTracer(), logger),
  ],
  handler,
  "/api/locale/get-locale",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrappedHandler)
  .getHandler();
