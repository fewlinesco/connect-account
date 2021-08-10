import {
  ConnectUnreachableError,
  getIdentity,
  GraphqlErrors,
  IdentityNotFoundError,
  IdentityTypes,
  removeIdentityFromUser,
} from "@fewlines/connect-management";
import {
  getServerSideCookies,
  Endpoint,
  HttpStatus,
  setAlertMessagesCookie,
} from "@fwl/web";
import { wrapMiddlewares } from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { UserCookie } from "@src/@types/user-cookie";
import { CONFIG_VARIABLES } from "@src/configs/config-variables";
import { formatAlertMessage, getLocaleFromRequest } from "@src/configs/intl";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";
import { generateAlertMessage } from "@src/utils/generate-alert-message";
import { getIdentityType } from "@src/utils/get-identity-type";

const get: Handler = async (request, response) => {
  const webErrors = {
    identityNotFound: ERRORS_DATA.IDENTITY_NOT_FOUND,
    graphqlErrors: ERRORS_DATA.GRAPHQL_ERRORS,
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
    invalidQueryString: ERRORS_DATA.INVALID_QUERY_STRING,
  };

  return getTracer().span("get-identity handler", async (span) => {
    const userCookie = await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
      cookieSalt: CONFIG_VARIABLES.cookieSalt,
    });

    if (!userCookie) {
      response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      response.setHeader("location", "/");
      response.end();
      return;
    }

    const { id: identityId } = request.query;

    if (!identityId || typeof identityId !== "string") {
      throw webErrorFactory(webErrors.invalidQueryString);
    }

    const identity = await getIdentity(CONFIG_VARIABLES.managementCredentials, {
      userId: userCookie.sub,
      identityId,
    }).catch((error) => {
      span.setDisclosedAttribute("is Identity fetched", false);
      if (
        error instanceof IdentityNotFoundError ||
        error.message === "Invalid UUID format"
      ) {
        throw webErrorFactory({
          ...webErrors.identityNotFound,
        });
      }

      if (error instanceof GraphqlErrors) {
        throw webErrorFactory({
          ...webErrors.graphqlErrors,
          parentError: error,
        });
      }

      if (error instanceof ConnectUnreachableError) {
        throw webErrorFactory({
          ...webErrors.connectUnreachable,
          parentError: error,
        });
      }

      throw error;
    });

    span.setDisclosedAttribute("is Identity fetched", true);
    response.statusCode = HttpStatus.OK;
    response.json(identity);
  });
};

const destroy: Handler = (request, response): Promise<void> => {
  const webErrors = {
    badRequest: ERRORS_DATA.BAD_REQUEST,
    identityNotFound: ERRORS_DATA.IDENTITY_NOT_FOUND,
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
  };

  return getTracer().span("delete-identity handler", async (span) => {
    const { type, value, id } = request.body;

    if (!type || !value || id !== request.query.id) {
      throw webErrorFactory(webErrors.badRequest);
    }

    span.setDisclosedAttribute("Identity type", type);

    const userCookie = await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
      cookieSalt: CONFIG_VARIABLES.cookieSalt,
    });

    if (!userCookie) {
      response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      response.setHeader("location", "/");
      response.end();
      return;
    }
    const data = {
      userId: userCookie.sub,
      identityType: type,
      identityValue: value,
    };

    return removeIdentityFromUser(CONFIG_VARIABLES.managementCredentials, data)
      .then(() => {
        span.setDisclosedAttribute("is Identity removed", true);

        const locale = getLocaleFromRequest(request, span);
        const localizedAlertMessageString =
          getIdentityType(type) === IdentityTypes.EMAIL
            ? formatAlertMessage(locale, "emailDeleted")
            : formatAlertMessage(locale, "phoneDeleted");

        setAlertMessagesCookie(response, [
          generateAlertMessage(localizedAlertMessageString),
        ]);

        response.statusCode = HttpStatus.ACCEPTED;
        response.setHeader("Content-Type", "application/json");
        response.end();
        return;
      })
      .catch((error) => {
        span.setDisclosedAttribute("is Identity removed", false);

        if (error instanceof GraphqlErrors) {
          throw webErrorFactory({
            ...webErrors.identityNotFound,
            parentError: error,
          });
        }

        if (error instanceof ConnectUnreachableError) {
          throw webErrorFactory({
            ...webErrors.connectUnreachable,
            parentError: error,
          });
        }

        throw error;
      });
  });
};

const middlewares = basicMiddlewares(getTracer(), logger);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrapMiddlewares(middlewares, get, "/api/identities/[id]/"))
  .delete(wrapMiddlewares(middlewares, destroy, "/api/identities/[id]/"))
  .getHandler();
