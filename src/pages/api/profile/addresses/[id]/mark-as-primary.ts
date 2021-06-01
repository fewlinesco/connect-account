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
import { wrappedProfileClient } from "@src/configs/profile-client";
import rateLimitingConfig from "@src/configs/rate-limiting-config";
import getTracer from "@src/configs/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import { generateAlertMessage } from "@src/utils/generate-alert-message";

const markAsPrimaryHandler: Handler = async (request, response) => {
  const webErrors = {
    invalidProfileToken: ERRORS_DATA.INVALID_PROFILE_TOKEN,
    invalidScopes: ERRORS_DATA.INVALID_SCOPES,
    unreachable: ERRORS_DATA.UNREACHABLE,
    invalidQueryString: ERRORS_DATA.INVALID_QUERY_STRING,
    addressNotFound: ERRORS_DATA.ADDRESS_NOT_FOUND,
    invalidUserAddressPayload: ERRORS_DATA.INVALID_USER_ADDRESS_PAYLOAD,
  };

  return getTracer().span(
    "POST /api/profile/addresses/[id]/mark-as-primary handler",
    async (span) => {
      const addressId = request.query.id;

      if (!addressId || typeof addressId !== "string") {
        throw webErrorFactory(webErrors.invalidQueryString);
      }

      const { userAddressClient } = await wrappedProfileClient(request, span);

      const { data: address } = await userAddressClient
        .markUserAddressAsPrimary(addressId)
        .then((addressData) => {
          setAlertMessagesCookie(response, [
            generateAlertMessage("Your address has been marked as primary"),
          ]);

          return addressData;
        })
        .catch((error) => {
          span.setDisclosedAttribute(
            "is Connect.Profile address marked as primary",
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

          throw webErrorFactory(webErrors.unreachable);
        });
      span.setDisclosedAttribute(
        "is Connect.Profile address marked as primary",
        true,
      );

      response.statusCode = HttpStatus.CREATED;
      response.json(address);
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
  .post(
    wrapMiddlewares(
      middlewares,
      markAsPrimaryHandler,
      "POST /api/profile/addresses/[id]/mark-as-primary",
    ),
  )
  .getHandler();
