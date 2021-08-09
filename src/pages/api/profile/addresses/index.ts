import { Endpoint, HttpStatus, setAlertMessagesCookie } from "@fwl/web";
import { wrapMiddlewares } from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { formatAlertMessage, getLocaleFromRequest } from "@src/configs/intl";
import { logger } from "@src/configs/logger";
import { wrappedProfileClient } from "@src/configs/profile-client";
import getTracer from "@src/configs/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";
import { generateAlertMessage } from "@src/utils/generate-alert-message";

const getHandler: Handler = async (request, response) => {
  const webErrors = {
    invalidProfileToken: ERRORS_DATA.INVALID_PROFILE_TOKEN,
    invalidScopes: ERRORS_DATA.INVALID_SCOPES,
    profileDataNotFound: ERRORS_DATA.PROFILE_DATA_NOT_FOUND,
    unreachable: ERRORS_DATA.UNREACHABLE,
  };

  return getTracer().span(
    "GET /api/profile/addresses/ handler",
    async (span) => {
      const { userAddressClient } = await wrappedProfileClient(request, span);

      const { data: userAddresses } = await userAddressClient
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

          if (error.response.status === HttpStatus.NOT_FOUND) {
            throw webErrorFactory(webErrors.profileDataNotFound);
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
    "POST /api/profile/addresses/ handler",
    async (span) => {
      const { userAddressClient } = await wrappedProfileClient(request, span);

      const { data: createdAddress } = await userAddressClient
        .createAddress(request.body)
        .then((addressData) => {
          const locale = getLocaleFromRequest(request, span);

          setAlertMessagesCookie(response, [
            generateAlertMessage(formatAlertMessage(locale, "addressAdded")),
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
            throw webErrorFactory({
              ...webErrors.invalidUserAddressPayload,
              errorDetails: error.response.data.details,
            });
          }

          throw webErrorFactory(webErrors.unreachable);
        });
      span.setDisclosedAttribute(
        "is Connect.Profile new address created",
        true,
      );

      response.statusCode = HttpStatus.CREATED;
      response.json(createdAddress);
    },
  );
};

const middlewares = basicMiddlewares(getTracer(), logger);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrapMiddlewares(middlewares, getHandler, "GET /api/profile/addresses/"))
  .post(
    wrapMiddlewares(middlewares, postHandler, "POST /api/profile/addresses/"),
  )
  .getHandler();
