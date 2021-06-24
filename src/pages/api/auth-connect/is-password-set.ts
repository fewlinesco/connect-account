import {
  ConnectUnreachableError,
  GraphqlErrors,
  isUserPasswordSet,
} from "@fewlines/connect-management";
import { Endpoint, getServerSideCookies, HttpStatus } from "@fwl/web";
import { wrapMiddlewares } from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { UserCookie } from "@src/@types/user-cookie";
import { configVariables } from "@src/configs/config-variables";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";

const handler: Handler = (request, response): Promise<void> => {
  const webErrors = {
    identityNotFound: ERRORS_DATA.IDENTITY_NOT_FOUND,
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
  };

  return getTracer().span("is-password-set handler", async (span) => {
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

    const isPasswordSet = await isUserPasswordSet(
      configVariables.managementCredentials,
      userCookie.sub,
    ).catch((error) => {
      span.setDisclosedAttribute("is password set info found", false);
      if (error instanceof GraphqlErrors) {
        throw webErrorFactory({
          ...webErrors.identityNotFound,
          parentError: error,
        });
      }

      if (error instanceof ConnectUnreachableError) {
        throw webErrorFactory({
          ...webErrors.connectUnreachable,
          parentError: error,
        });
      }

      throw error;
    });

    span.setDisclosedAttribute("is password set info found", true);
    response.statusCode = HttpStatus.OK;
    response.json({ isPasswordSet });
  });
};

const wrappedHandler = wrapMiddlewares(
  basicMiddlewares(getTracer(), logger),
  handler,
  "/api/auth-connect/is-password-set",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrappedHandler)
  .getHandler();
