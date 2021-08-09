import {
  ConnectUnreachableError,
  GraphqlErrors,
  IdentityTypes,
  markIdentityAsPrimary,
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
import { isMarkingIdentityAsPrimaryAuthorized } from "@src/utils/is-marking-identity-as-primary-authorized";

const markAsPrimary: Handler = async (request, response) => {
  const webErrors = {
    badRequest: ERRORS_DATA.BAD_REQUEST,
    identityNotFound: ERRORS_DATA.IDENTITY_NOT_FOUND,
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
    invalidBody: ERRORS_DATA.INVALID_BODY,
  };

  return getTracer().span("mark-identity-as-primary handler", async (span) => {
    const { id: identityId } = request.query as { [key: string]: string };

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

    const isAuthorized = await isMarkingIdentityAsPrimaryAuthorized(
      userCookie.sub,
      identityId,
    ).catch((error) => {
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

    if (!isAuthorized) {
      span.setDisclosedAttribute(
        "is mark Identity as primary authorized",
        false,
      );

      throw webErrorFactory(webErrors.badRequest);
    }

    span.setDisclosedAttribute("is mark Identity as primary authorized", true);

    return markIdentityAsPrimary(
      CONFIG_VARIABLES.managementCredentials,
      identityId,
    )
      .then((identity) => {
        span.setDisclosedAttribute("is Identity marked as primary", true);

        const locale = getLocaleFromRequest(request, span);
        const localizedAlertMessageString =
          getIdentityType(identity.type) === IdentityTypes.EMAIL
            ? formatAlertMessage(locale, "emailMarkedAsPrimary")
            : formatAlertMessage(locale, "phoneMarkedAsPrimary");

        setAlertMessagesCookie(response, [
          generateAlertMessage(
            `${identity.value} ${localizedAlertMessageString}`,
          ),
        ]);

        response.statusCode = HttpStatus.OK;
        response.setHeader("Content-type", "application/json");
        response.end();
        return;
      })
      .catch((error) => {
        span.setDisclosedAttribute("is Identity marked as primary", false);

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

const markAsPrimaryWrappedHandler = wrapMiddlewares(
  basicMiddlewares(getTracer(), logger),
  markAsPrimary,
  "/api/identities/[id]/mark-as-primary/",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .post(markAsPrimaryWrappedHandler)
  .getHandler();
