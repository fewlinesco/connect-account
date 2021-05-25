import { getServerSideCookies, Endpoint, HttpStatus } from "@fwl/web";
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
import { initProfileClient } from "@src/configs/profile-client";
import rateLimitingConfig from "@src/configs/rate-limiting-config";
import getTracer from "@src/configs/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import { getProfileAndAddressAccessTokens } from "@src/utils/get-profile-and-address-access-tokens";

const postHandler: Handler = async (request, response) => {
  const webErrors = {
    invalidProfileToken: ERRORS_DATA.INVALID_PROFILE_TOKEN,
    invalidScopes: ERRORS_DATA.INVALID_SCOPES,
    userProfileNotFound: ERRORS_DATA.USER_PROFILE_NOT_FOUND,
    invalidUserAddressPayload: ERRORS_DATA.INVALID_USER_ADDRESS_PAYLOAD,
    unreachable: ERRORS_DATA.UNREACHABLE,
  };

  return getTracer().span(
    "POST /api/profile/addresses handler",
    async (span) => {
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

      const userAddressPayload = request.body;

      const { addressAccessToken } = await getProfileAndAddressAccessTokens(
        userCookie.access_token,
      );
      span.setDisclosedAttribute(
        "is Connect.Profile access token available",
        true,
      );

      const addressClient = initProfileClient(addressAccessToken);

      const { data: createdAddress } = await addressClient
        .createAddress(userAddressPayload)
        .catch((error) => {
          span.setDisclosedAttribute(
            "is Connect.Profile new address created",
            false,
          );

          if (error.response.status === HttpStatus.UNAUTHORIZED) {
            throw webErrorFactory(webErrors.invalidProfileToken);
          }

          if (error.response.status === HttpStatus.FORBIDDEN) {
            throw webErrorFactory(webErrors.invalidScopes);
          }

          if (error.response.status === HttpStatus.UNPROCESSABLE_ENTITY) {
            throw webErrorFactory(webErrors.invalidUserAddressPayload);
          }

          throw webErrorFactory(webErrors.unreachable);
        });
      span.setDisclosedAttribute(
        "is Connect.Profile new address created",
        true,
      );

      response.statusCode = HttpStatus.OK;
      response.json({ createdAddress });
    },
  );
};

const wrappedPostHandler = wrapMiddlewares(
  [
    tracingMiddleware(getTracer()),
    rateLimitingMiddleware(getTracer(), logger, rateLimitingConfig),
    recoveryMiddleware(getTracer()),
    sentryMiddleware(getTracer()),
    errorMiddleware(getTracer()),
    loggingMiddleware(getTracer(), logger),
    authMiddleware(getTracer()),
  ],
  postHandler,
  "POST /api/profile/addresses",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .post(wrappedPostHandler)
  .getHandler();
