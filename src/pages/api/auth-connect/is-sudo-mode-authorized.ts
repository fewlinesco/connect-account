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
import getTracer from "@src/configs/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";

const handler: Handler = (request, response): Promise<void> => {
  return getTracer().span("is-sudo-mode-authorized handler", async (span) => {
    const webErrors = {
      connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
      databaseUnreachable: ERRORS_DATA.DATABASE_UNREACHABLE,
      invalidBody: ERRORS_DATA.INVALID_BODY,
      invalidValidationCode: ERRORS_DATA.INVALID_VALIDATION_CODE,
      noUserFound: ERRORS_DATA.NO_USER_FOUND,
      sudoModeTTLNotFound: ERRORS_DATA.SUDO_MODE_TTL_NOT_FOUND,
    };

    const userCookie = await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
      cookieSalt: configVariables.cookieSalt,
    });

    if (!userCookie) {
      response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      response.setHeader("location", "/");
      response.end();
      return;
    }

    const user = await getDBUserFromSub(userCookie.sub).catch((error) => {
      span.setDisclosedAttribute("database reachable", false);
      throw webErrorFactory({
        ...webErrors.databaseUnreachable,
        parentError: error,
      });
    });

    if (!user) {
      span.setDisclosedAttribute("user found", false);
      throw webErrorFactory(webErrors.noUserFound);
    }
    span.setDisclosedAttribute("user found", true);

    const sudoModeTTL = user.sudo.sudo_mode_ttl;

    if (!sudoModeTTL) {
      span.setDisclosedAttribute("sudo mode ttl found", false);
      throw webErrorFactory(webErrors.sudoModeTTLNotFound);
    }
    span.setDisclosedAttribute("sudo mode ttl found", true);

    console.log("referrer: ", request.headers.referer);
    console.log("sudoModeTTL: ", sudoModeTTL);

    if (Date.now() > sudoModeTTL) {
      response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      response.setHeader("location", request.headers.referer || "");
      response.json({ isSudoModeAuthorized: false });
      return;
    }

    response.statusCode = HttpStatus.OK;
    response.json({ isSudoModeAuthorized: true });
    return;
  });
};

const wrappedHandler = wrapMiddlewares(
  [
    tracingMiddleware(getTracer()),
    rateLimitingMiddleware(getTracer(), logger, {
      windowMs: 300000,
      requestsUntilBlock: 200,
    }),
    recoveryMiddleware(getTracer()),
    sentryMiddleware(getTracer()),
    errorMiddleware(getTracer()),
    loggingMiddleware(getTracer(), logger),
    authMiddleware(getTracer()),
  ],
  handler,
  "/api/auth-connect/is-sudo-mode-authorized",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrappedHandler)
  .getHandler();
