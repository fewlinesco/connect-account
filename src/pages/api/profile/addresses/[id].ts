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
import { getProfileAndAddressAccessTokens } from "@src/utils/get-profile-and-address-access-tokens";

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
    "GET /api/profile/addresses/[id] handler",
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

      const addressId = request.query.id;

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

const patchHandler: Handler = async (request, response) => {
  const webErrors = {
    invalidProfileToken: ERRORS_DATA.INVALID_PROFILE_TOKEN,
    invalidScopes: ERRORS_DATA.INVALID_SCOPES,
    unreachable: ERRORS_DATA.UNREACHABLE,
    invalidQueryString: ERRORS_DATA.INVALID_QUERY_STRING,
    addressNotFound: ERRORS_DATA.ADDRESS_NOT_FOUND,
    invalidUserAddressPayload: ERRORS_DATA.INVALID_USER_ADDRESS_PAYLOAD,
  };

  return getTracer().span(
    "PATCH /api/profile/addresses/[id] handler",
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

      const addressId = request.query.id;

      if (!addressId || typeof addressId !== "string") {
        throw webErrorFactory(webErrors.invalidQueryString);
      }

      const userAddressPayload = request.body;

      const { profileAccessToken } = await getProfileAndAddressAccessTokens(
        userCookie.access_token,
      );
      span.setDisclosedAttribute(
        "is Connect.Profile access token available",
        true,
      );

      const profileClient = initProfileClient(profileAccessToken);

      const { data: updatedUserAddress } = await profileClient
        .updateAddress(addressId, userAddressPayload)
        .catch((error) => {
          span.setDisclosedAttribute(
            "is Connect.Profile address updated",
            false,
          );

          if (error.response.status === HttpStatus.UNAUTHORIZED) {
            throw webErrorFactory(webErrors.invalidProfileToken);
          }

          if (error.response.status === HttpStatus.FORBIDDEN) {
            throw webErrorFactory(webErrors.invalidScopes);
          }

          if (error.response.status === HttpStatus.NOT_FOUND) {
            throw webErrorFactory(webErrors.addressNotFound);
          }

          if (error.response.status === HttpStatus.UNPROCESSABLE_ENTITY) {
            throw webErrorFactory(webErrors.invalidUserAddressPayload);
          }

          throw webErrorFactory(webErrors.unreachable);
        });
      span.setDisclosedAttribute("is Connect.Profile address updated", true);

      response.statusCode = HttpStatus.OK;
      response.json({ updatedUserAddress });
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

const wrappedPatchHandler = wrapMiddlewares(
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
  patchHandler,
  "PATCH /api/profile/addresses/[id]",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrappedGetHandler)
  .patch(wrappedPatchHandler)
  .getHandler();
