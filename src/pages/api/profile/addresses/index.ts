import {
  getServerSideCookies,
  Endpoint,
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
import { generateAlertMessage } from "@src/utils/generate-alert-message";
import { getProfileAndAddressAccessTokens } from "@src/utils/get-profile-and-address-access-tokens";

const getHandler: Handler = async (request, response) => {
  const webErrors = {
    invalidProfileToken: ERRORS_DATA.INVALID_PROFILE_TOKEN,
    invalidScopes: ERRORS_DATA.INVALID_SCOPES,
    profileDataNotFound: ERRORS_DATA.PROFILE_DATA_NOT_FOUND,
    unreachable: ERRORS_DATA.UNREACHABLE,
  };

  return getTracer().span(
    "GET /api/profile/addresses handler",
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

      const { addressAccessToken } = await getProfileAndAddressAccessTokens(
        userCookie.access_token,
      );

      span.setDisclosedAttribute(
        "is Connect.Profile access token available",
        true,
      );

      const addressClient = initProfileClient(addressAccessToken);

      const { data: userAddresses } = await addressClient
        .getAddresses()
        .catch((error) => {
          span.setDisclosedAttribute(
            "is Connect.Profile UserAddresses fetched",
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

      span.setDisclosedAttribute(
        "is Connect.Profile UserAddresses fetched",
        true,
      );

      response.statusCode = HttpStatus.OK;
      response.json(userAddresses);
    },
  );
};

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
        .then((addressData) => {
          setAlertMessagesCookie(response, [
            generateAlertMessage("Your address has been added"),
          ]);

          return addressData;
        })
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

const middlewares: Middleware<NextApiRequest, NextApiResponse>[] = [
  tracingMiddleware(getTracer()),
  rateLimitingMiddleware(getTracer(), logger, rateLimitingConfig),
  recoveryMiddleware(getTracer()),
  sentryMiddleware(getTracer()),
  errorMiddleware(getTracer()),
  loggingMiddleware(getTracer(), logger),
  authMiddleware(getTracer()),
];

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrapMiddlewares(middlewares, getHandler, "GET /api/profile/addresses"))
  .post(
    wrapMiddlewares(middlewares, postHandler, "POST /api/profile/addresses"),
  )
  .getHandler();
