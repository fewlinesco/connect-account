import {
  Endpoint,
  getServerSideCookies,
  HttpStatus,
  setAlertMessagesCookie,
} from "@fwl/web";
import {
  loggingMiddleware,
  wrapMiddlewares,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
  rateLimitingMiddleware,
  Middleware,
} from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { DynamoUser } from "@src/@types/dynamo-user";
import { Handler } from "@src/@types/handler";
import { UserCookie } from "@src/@types/user-cookie";
import { getAndPutUser } from "@src/commands/get-and-put-user";
import { configVariables } from "@src/configs/config-variables";
import { logger } from "@src/configs/logger";
import rateLimitingConfig from "@src/configs/rate-limiting-config";
import getTracer from "@src/configs/tracer";
import { NoUserCookieFoundError } from "@src/errors/errors";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";
import { generateAlertMessage } from "@src/utils/generate-alert-message";
import { AVAILABLE_LANGUAGE } from "@src/utils/get-locale";

const getHandler: Handler = (request, response): Promise<void> => {
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

    span.setDisclosedAttribute("user locale retrieved", true);
    span.setDisclosedAttribute("user locale value", currentDBUser.locale);
    response.statusCode = HttpStatus.OK;
    response.json({ locale: currentDBUser.locale });
    return;
  });
};

const patchHandler: Handler = (request, response): Promise<void> => {
  const webErrors = {
    badRequest: ERRORS_DATA.BAD_REQUEST,
    databaseUnreachable: ERRORS_DATA.DATABASE_UNREACHABLE,
  };

  return getTracer().span("set-locale handler", async (span) => {
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

    const currentDBUser = await getDBUserFromSub(userCookie.sub);
    const { locale } = request.body;

    if (!locale) {
      throw webErrorFactory(webErrors.badRequest);
    }

    await getAndPutUser({
      ...(currentDBUser as DynamoUser),
      locale: locale as string,
    })
      .then(() =>
        setAlertMessagesCookie(response, [
          generateAlertMessage(
            `Your language has been set to ${AVAILABLE_LANGUAGE[locale]}`,
          ),
        ]),
      )
      .catch((error) => {
        span.setDisclosedAttribute("user locale set", false);
        throw webErrorFactory({
          ...webErrors.databaseUnreachable,
          parentError: error,
        });
      });

    span.setDisclosedAttribute("user locale set", true);
    response.statusCode = HttpStatus.OK;
    response.setHeader("Content-Type", "application/json");
    response.end();
    return;
  });
};

const middlewares: Middleware<NextApiRequest, NextApiResponse>[] = [
  tracingMiddleware(getTracer()),
  rateLimitingMiddleware(getTracer(), logger, rateLimitingConfig),
  recoveryMiddleware(getTracer()),
  sentryMiddleware(getTracer()),
  errorMiddleware(getTracer()),
  loggingMiddleware(getTracer(), logger),
];

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrapMiddlewares(middlewares, getHandler, "GET /api/locale"))
  .patch(wrapMiddlewares(middlewares, patchHandler, "POST /api/locale"))
  .getHandler();
