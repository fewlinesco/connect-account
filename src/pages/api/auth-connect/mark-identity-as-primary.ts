import { markIdentityAsPrimary } from "@fewlines/connect-management";
import { Endpoint, HttpStatus } from "@fwl/web";
import {
  loggingMiddleware,
  wrapMiddlewares,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
} from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/core/Handler";
import { UserCookie } from "@src/@types/user-cookie";
import { config } from "@src/config";
import { logger } from "@src/logger";
import { withAuth } from "@src/middlewares/with-auth";
import { withSentry } from "@src/middlewares/with-sentry";
import getTracer from "@src/tracer";
import { isMarkingIdentityAsPrimaryAuthorized } from "@src/utils/is-marking-identity-as-primary-authorized";
import { getServerSideCookies } from "@src/utils/server-side-cookies";

const tracer = getTracer();

const handler: Handler = async (request, response) => {
  return tracer.span("mark-identity-as-primary handler", async (span) => {
    const { identityId } = request.body;

    const userCookie = await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
    });

    if (userCookie) {
      const isAuthorized = await isMarkingIdentityAsPrimaryAuthorized(
        userCookie.sub,
        identityId,
      );

      if (isAuthorized) {
        span.setDisclosedAttribute(
          "Is identity marked as primary authorized",
          true,
        );

        return markIdentityAsPrimary(
          config.managementCredentials,
          identityId,
        ).then(() => {
          response.statusCode = HttpStatus.OK;
          response.setHeader("Content-type", "application/json");
          response.end();
          return;
        });
      }

      span.setDisclosedAttribute(
        "Is identity marked as primary authorized",
        false,
      );

      response.statusCode = HttpStatus.BAD_REQUEST;
      response.end();
      return;
    } else {
      response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      response.setHeader("location", "/");
      response.end();
      return;
    }
  });
};

const wrappedHandler = wrapMiddlewares(
  [
    tracingMiddleware(tracer),
    recoveryMiddleware(tracer),
    errorMiddleware(tracer),
    loggingMiddleware(tracer, logger),
    withSentry,
    withAuth,
  ],
  handler,
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .post(wrappedHandler)
  .getHandler();
