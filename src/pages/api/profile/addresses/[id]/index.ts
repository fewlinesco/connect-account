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
    invalidQueryString: ERRORS_DATA.INVALID_QUERY_STRING,
    addressNotFound: ERRORS_DATA.ADDRESS_NOT_FOUND,
  };

  return getTracer().span(
    "GET /api/profile/addresses/[id]/ handler",
    async (span) => {
      const addressId = request.query.id;

      if (!addressId || typeof addressId !== "string") {
        throw webErrorFactory(webErrors.invalidQueryString);
      }

      const { userAddressClient } = await wrappedProfileClient(request, span);

      const { data: profileAddresses } = await userAddressClient
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
      response.json(address);
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
    "PATCH /api/profile/addresses/[id]/ handler",
    async (span) => {
      const addressId = request.query.id;

      if (!addressId || typeof addressId !== "string") {
        throw webErrorFactory(webErrors.invalidQueryString);
      }

      const { userAddressClient } = await wrappedProfileClient(request, span);

      const { data: updatedUserAddress } = await userAddressClient
        .updateAddress(addressId, request.body)
        .then((addressData) => {
          const locale = getLocaleFromRequest(request, span);

          setAlertMessagesCookie(response, [
            generateAlertMessage(formatAlertMessage(locale, "addressUpdated")),
          ]);

          return addressData;
        })
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
            throw webErrorFactory({
              ...webErrors.invalidUserAddressPayload,
              errorDetails: error.response.data.details,
            });
          }

          throw webErrorFactory(webErrors.unreachable);
        });
      span.setDisclosedAttribute("is Connect.Profile address updated", true);

      response.statusCode = HttpStatus.OK;
      response.json(updatedUserAddress);
    },
  );
};

const deleteHandler: Handler = async (request, response) => {
  const webErrors = {
    invalidProfileToken: ERRORS_DATA.INVALID_PROFILE_TOKEN,
    invalidScopes: ERRORS_DATA.INVALID_SCOPES,
    unreachable: ERRORS_DATA.UNREACHABLE,
    invalidQueryString: ERRORS_DATA.INVALID_QUERY_STRING,
    addressNotFound: ERRORS_DATA.ADDRESS_NOT_FOUND,
  };

  return getTracer().span(
    "DELETE /api/profile/addresses/[id]/ handler",
    async (span) => {
      const addressId = request.query.id;

      if (!addressId || typeof addressId !== "string") {
        throw webErrorFactory(webErrors.invalidQueryString);
      }

      const { userAddressClient } = await wrappedProfileClient(request, span);

      await userAddressClient
        .deleteAddress(addressId)
        .then((addressData) => {
          const locale = getLocaleFromRequest(request, span);

          setAlertMessagesCookie(response, [
            generateAlertMessage(formatAlertMessage(locale, "addressDeleted")),
          ]);

          return addressData;
        })
        .catch((error) => {
          span.setDisclosedAttribute(
            "is Connect.Profile address deleted",
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

      span.setDisclosedAttribute("is Connect.Profile address deleted", true);

      response.statusCode = HttpStatus.NO_CONTENT;
      response.end();
    },
  );
};

const middlewares = basicMiddlewares(getTracer(), logger);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(
    wrapMiddlewares(
      middlewares,
      getHandler,
      "GET /api/profile/addresses/[id]/",
    ),
  )
  .patch(
    wrapMiddlewares(
      middlewares,
      patchHandler,
      "PATCH /api/profile/addresses/[id]/",
    ),
  )
  .delete(
    wrapMiddlewares(
      middlewares,
      deleteHandler,
      "DELETE /api/profile/addresses/[id]/",
    ),
  )
  .getHandler();
