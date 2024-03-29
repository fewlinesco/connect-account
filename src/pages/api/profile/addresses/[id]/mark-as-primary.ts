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
    "POST /api/profile/addresses/[id]/mark-as-primary/ handler",
    async (span) => {
      const addressId = request.query.id;

      if (!addressId || typeof addressId !== "string") {
        throw webErrorFactory(webErrors.invalidQueryString);
      }

      const { userAddressClient } = await wrappedProfileClient(request, span);

      const { data: address } = await userAddressClient
        .markUserAddressAsPrimary(addressId)
        .then((addressData) => {
          const locale = getLocaleFromRequest(request, span);

          setAlertMessagesCookie(response, [
            generateAlertMessage(
              formatAlertMessage(locale, "addressMarkedAsPrimary"),
            ),
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

const middlewares = basicMiddlewares(getTracer(), logger);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .post(
    wrapMiddlewares(
      middlewares,
      markAsPrimaryHandler,
      "POST /api/profile/addresses/[id]/mark-as-primary/",
    ),
  )
  .getHandler();
