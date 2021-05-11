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

const patchHandler: Handler = async (request, response) => {
  const webErrors = {
    invalidProfileToken: ERRORS_DATA.INVALID_PROFILE_TOKEN,
    invalidScopes: ERRORS_DATA.INVALID_SCOPES,
    userProfileNotFound: ERRORS_DATA.USER_PROFILE_NOT_FOUND,
    invalidUserProfilePayload: ERRORS_DATA.INVALID_USER_PROFILE_PAYLOAD,
    unreachable: ERRORS_DATA.UNREACHABLE,
  };

  return getTracer().span(
    "PATCH /api/profile/user-profile handler",
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

      const { userProfilePayload } = request.body;

      const { profileAccessToken } = await getProfileAndAddressAccessTokens(
        userCookie.access_token,
      );
      span.setDisclosedAttribute(
        "is Connect.Profile access token available",
        true,
      );

      const profileClient = initProfileClient(profileAccessToken);

      const { data: updatedUserProfile } = await profileClient
        .patchProfile(userProfilePayload)
        .catch((error) => {
          span.setDisclosedAttribute(
            "is Connect.Profile UserProfile updated",
            false,
          );

          if (error.response.status === HttpStatus.UNAUTHORIZED) {
            throw webErrorFactory(webErrors.invalidProfileToken);
          }

          if (error.response.status === HttpStatus.FORBIDDEN) {
            throw webErrorFactory(webErrors.invalidScopes);
          }

          if (error.response.status === HttpStatus.NOT_FOUND) {
            throw webErrorFactory(webErrors.userProfileNotFound);
          }

          if (error.response.status === HttpStatus.UNPROCESSABLE_ENTITY) {
            throw webErrorFactory(webErrors.invalidUserProfilePayload);
          }

          throw webErrorFactory(webErrors.unreachable);
        });
      span.setDisclosedAttribute(
        "is Connect.Profile UserProfile updated",
        true,
      );

      response.statusCode = HttpStatus.OK;
      response.json({ updatedUserProfile });
    },
  );
};

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
  "PATCH /api/profile/user-profile",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .patch(wrappedPatchHandler)
  .getHandler();
