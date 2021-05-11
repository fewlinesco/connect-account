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
import getTracer from "@src/configs/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import { getProfileAndAddressAccessTokens } from "@src/utils/get-profile-address-access-token";

const getHandler: Handler = async (request, response) => {
  const webErrors = {
    invalidProfileToken: ERRORS_DATA.INVALID_PROFILE_TOKEN,
    invalidScopes: ERRORS_DATA.INVALID_SCOPES,
    profileDataNotFound: ERRORS_DATA.PROFILE_DATA_NOT_FOUND,
    unreachable: ERRORS_DATA.UNREACHABLE,
    invalidQueryString: ERRORS_DATA.INVALID_QUERY_STRING,
    addressNotFound: ERRORS_DATA.ADDRESS_NOT_FOUND,
  };

  return getTracer().span(
    "/api/profile/addresses/[id] getHandler",
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

      const addressId = request.query.addressId;

      if (!addressId || typeof addressId !== "string") {
        throw webErrorFactory(webErrors.invalidQueryString);
      }

      const { addressAccessToken } = await getProfileAndAddressAccessTokens(
        userCookie.access_token,
      );
      span.setDisclosedAttribute(
        "is Connect.Profile access token available",
        true,
      );

      const addressClient = initProfileClient(addressAccessToken);

      const { data: profileAddresses } = await addressClient
        .getAddresses()
        .catch((error) => {
          span.setDisclosedAttribute(
            "is Connect.Profile addresses fetched",
            false,
          );

          if (error.response.status === HttpStatus.UNAUTHORIZED) {
            throw webErrorFactory(webErrors.invalidProfileToken);
          }

          if (error.response.status === HttpStatus.FORBIDDEN) {
            throw webErrorFactory(webErrors.invalidScopes);
          }

          throw webErrorFactory(webErrors.unreachable);
        });
      span.setDisclosedAttribute("is Connect.Profile addresses fetched", true);

      const address = profileAddresses.find(
        (address) => address.id === addressId,
      );

      if (!address) {
        throw webErrorFactory(webErrors.addressNotFound);
      }

      response.statusCode = HttpStatus.OK;
      response.json({ address });
    },
  );
};

const wrappedGetHandler = wrapMiddlewares(
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
  getHandler,
  "GET /api/profile/addresses/[id]",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrappedGetHandler)
  .getHandler();
