import {
  createOrUpdatePassword,
  InvalidPasswordInputError,
} from "@fewlines/connect-management";
import { Endpoint, HttpStatus, getServerSideCookies } from "@fwl/web";
import {
  loggingMiddleware,
  wrapMiddlewares,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
} from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { UserCookie } from "@src/@types/user-cookie";
import { config } from "@src/config";
import { logger } from "@src/logger";
import { withAuth } from "@src/middlewares/with-auth";
import { withSentry } from "@src/middlewares/with-sentry";
import getTracer from "@src/tracer";

const tracer = getTracer();

const handler: Handler = async (request, response) => {
  return tracer.span("set-password handler", async (span) => {
    const { passwordInput } = request.body;

    const userCookie = await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
    });

    if (userCookie) {
      return createOrUpdatePassword(config.managementCredentials, {
        cleartextPassword: passwordInput,
        userId: userCookie.sub,
      })
        .then(() => {
          span.setDisclosedAttribute("password created or updated", true);

          response.setHeader("Content-Type", "application/json");
          response.statusCode = HttpStatus.OK;
          response.end();
          return;
        })
        .catch((error) => {
          if (error instanceof InvalidPasswordInputError) {
            span.setDisclosedAttribute("invalid password input", true);

            response.setHeader("Content-Type", "application/json");
            response.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
            response.json({ restrictionRulesError: error.rules });
            return;
          }

          response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          response.end();
          return;
        });
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
