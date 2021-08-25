import {
  ConnectUnreachableError,
  getIdentities,
  GraphqlErrors,
  IdentityTypes,
} from "@fewlines/connect-management";
import { Endpoint, getServerSideCookies, HttpStatus } from "@fwl/web";
import { wrapMiddlewares } from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { UserCookie } from "@src/@types/user-cookie";
import { CONFIG_VARIABLES } from "@src/configs/config-variables";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";
import { getIdentityType } from "@src/utils/get-identity-type";

const getHandler: Handler = (request, response): Promise<void> => {
  const webErrors = {
    badRequest: ERRORS_DATA.BAD_REQUEST,
    identityNotFound: ERRORS_DATA.IDENTITY_NOT_FOUND,
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
  };

  return getTracer().span("get-sorted-identities handler", async (span) => {
    const userCookie = await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
      cookieSalt: CONFIG_VARIABLES.cookieSalt,
    });

    if (!userCookie) {
      response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      response.setHeader("location", "/");
      return response.end();
    }

    const identities = await getIdentities(
      CONFIG_VARIABLES.managementCredentials,
      userCookie.sub,
    )
      .then((unfilteredIdentities) => {
        return request.query.primary && request.query.primary === "true/"
          ? unfilteredIdentities.filter((identity) => {
              return (
                identity.primary &&
                (getIdentityType(identity.type) === IdentityTypes.EMAIL ||
                  getIdentityType(identity.type) === IdentityTypes.PHONE)
              );
            })
          : unfilteredIdentities;
      })
      .catch((error) => {
        span.setDisclosedAttribute("identities found", false);

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

    span.setDisclosedAttribute("identities found", true);
    response.statusCode = HttpStatus.OK;
    return response.end(JSON.stringify(identities));
  });
};

const wrappedHandler = wrapMiddlewares(
  basicMiddlewares(getTracer(), logger),
  getHandler,
  "/api/identities/",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrappedHandler)
  .getHandler();
