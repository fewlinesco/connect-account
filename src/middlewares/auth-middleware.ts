import {
  AlgoNotSupportedError,
  InvalidAudienceError,
  InvalidKeyIDRS256Error,
  MissingJWKSURIError,
  MissingKeyIDHS256Error,
  UnreachableError,
} from "@fewlines/connect-client";
import { Tracer } from "@fwl/tracing";
import { getServerSideCookies, HttpStatus } from "@fwl/web";
import { Middleware } from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { UserCookie } from "@src/@types/user-cookie";
import { configVariables } from "@src/configs/config-variables";
import {
  NoDBUserFoundError,
  NoUserCookieFoundError,
  UnhandledTokenType,
} from "@src/errors/errors";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { decryptVerifyAccessToken } from "@src/workflows/decrypt-verify-access-token";

async function authentication(
  tracer: Tracer,
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const webErrors = {
    unreachable: ERRORS_DATA.UNREACHABLE,
    databaseUnreachable: ERRORS_DATA.DATABASE_UNREACHABLE,
    badRequest: ERRORS_DATA.BAD_REQUEST,
    temporaryRedirection: ERRORS_DATA.TEMPORARY_REDIRECT,
    unauthorized: ERRORS_DATA.UNAUTHORIZED,
  };

  return tracer.span("auth-middleware", async (span) => {
    const userCookie = await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
      cookieSalt: configVariables.cookieSalt,
    });

    if (!userCookie) {
      span.setDisclosedAttribute("user cookie found", false);
      throw new NoUserCookieFoundError();
    }
    span.setDisclosedAttribute("user cookie found", true);

    const { access_token: currentAccessToken } = userCookie;

    await decryptVerifyAccessToken(currentAccessToken).catch(async (error) => {
      if (error.name === "TokenExpiredError") {
        span.setDisclosedAttribute("is access_token expired", true);

        console.log("request.url: ", request.url);

        if (request.url && request.url.includes("/api/")) {
          throw webErrorFactory(webErrors.unauthorized);
        }

        console.log("referer:", request.headers.referer);

        const redirectURL = !request.url ? "/account" : request.url;

        response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
        response.setHeader(
          "location",
          `/api/auth-connect/refresh-token-flow?next=${redirectURL}`,
        );
        throw webErrorFactory(webErrors.temporaryRedirection);
      }

      if (
        error instanceof MissingJWKSURIError ||
        error instanceof InvalidAudienceError ||
        error instanceof MissingKeyIDHS256Error ||
        error instanceof AlgoNotSupportedError ||
        error instanceof InvalidKeyIDRS256Error ||
        error instanceof UnhandledTokenType
      ) {
        throw webErrorFactory({
          ...webErrors.badRequest,
          parentError: error,
        });
      }

      if (error instanceof UnreachableError) {
        throw webErrorFactory({
          ...webErrors.unreachable,
          parentError: error,
        });
      }

      throw error;
    });

    span.setDisclosedAttribute("is access_token valid", true);
  });
}

function authMiddleware(
  tracer: Tracer,
): Middleware<NextApiRequest, NextApiResponse> {
  return (handler) => {
    return async (
      request: NextApiRequest,
      response: NextApiResponse,
    ): Promise<void> => {
      return await authentication(tracer, request, response)
        .then(() => handler(request, response))
        .catch((error) => {
          if (
            error instanceof NoDBUserFoundError ||
            error instanceof NoUserCookieFoundError
          ) {
            return {
              redirect: {
                destination: "/",
                permanent: false,
              },
            };
          }

          throw error;
        });
    };
  };
}

export { authMiddleware };
