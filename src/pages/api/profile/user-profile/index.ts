import { Endpoint, HttpStatus, setAlertMessagesCookie } from "@fwl/web";
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
import { logger } from "@src/configs/logger";
import { initProfileClient } from "@src/configs/profile-client";
import rateLimitingConfig from "@src/configs/rate-limiting-config";
import getTracer from "@src/configs/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import { generateAlertMessage } from "@src/utils/generate-alert-message";

const getHandler: Handler = async (request, response) => {
  const webErrors = {
    invalidProfileToken: ERRORS_DATA.INVALID_PROFILE_TOKEN,
    invalidScopes: ERRORS_DATA.INVALID_SCOPES,
    profileDataNotFound: ERRORS_DATA.PROFILE_DATA_NOT_FOUND,
    unreachable: ERRORS_DATA.UNREACHABLE,
  };

  return getTracer().span(
    "GET /api/profile/user-profile handler",
    async (span) => {
      const { userProfileClient } = await initProfileClient(request, span);

      const { data: userProfile } = await userProfileClient
        .getProfile()
        .catch((error) => {
          span.setDisclosedAttribute(
            "is Connect.Profile UserProfile fetched",
            false,
          );

          if (error.response.status === HttpStatus.UNAUTHORIZED) {
            throw webErrorFactory(webErrors.invalidProfileToken);
          }

          if (error.response.status === HttpStatus.FORBIDDEN) {
            throw webErrorFactory(webErrors.invalidScopes);
          }

          if (error.response.status === HttpStatus.NOT_FOUND) {
            throw webErrorFactory(webErrors.profileDataNotFound);
          }

          throw webErrorFactory(webErrors.unreachable);
        });

      span.setDisclosedAttribute(
        "is Connect.Profile UserProfile fetched",
        true,
      );

      response.statusCode = HttpStatus.OK;
      response.json(userProfile);
    },
  );
};

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
      const { userProfileClient } = await initProfileClient(request, span);

      const { data: updatedUserProfile } = await userProfileClient
        .patchProfile(request.body)
        .then((profileData) => {
          setAlertMessagesCookie(response, [
            generateAlertMessage("Your profile has been updated"),
          ]);

          return profileData;
        })
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

const postHandler: Handler = async (request, response) => {
  const webErrors = {
    invalidProfileToken: ERRORS_DATA.INVALID_PROFILE_TOKEN,
    invalidScopes: ERRORS_DATA.INVALID_SCOPES,
    userProfileNotFound: ERRORS_DATA.USER_PROFILE_NOT_FOUND,
    invalidUserProfilePayload: ERRORS_DATA.INVALID_USER_PROFILE_PAYLOAD,
    unreachable: ERRORS_DATA.UNREACHABLE,
  };

  return getTracer().span(
    "POST /api/profile/user-profile handler",
    async (span) => {
      const { userProfileClient } = await initProfileClient(request, span);

      const { data: createdUserProfile } = await userProfileClient
        .createProfile(request.body)
        .then((profileData) => {
          setAlertMessagesCookie(response, [
            generateAlertMessage("Your profile has been created"),
          ]);

          return profileData;
        })
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
      response.json({ createdUserProfile });
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
  .get(
    wrapMiddlewares(middlewares, getHandler, "GET /api/profile/user-profile"),
  )
  .patch(
    wrapMiddlewares(
      middlewares,
      patchHandler,
      "PATCH /api/profile/user-profile",
    ),
  )
  .post(
    wrapMiddlewares(middlewares, postHandler, "POST /api/profile/user-profile"),
  )
  .getHandler();
