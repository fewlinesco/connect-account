import { defaultPayload, generateHS256JWS } from "@fewlines/connect-client";
import { getTracer } from "@fwl/tracing";
import { HttpStatus } from "@fwl/web";
import { WebError } from "@fwl/web/dist/errors";
import { wrapMiddlewares } from "@fwl/web/dist/middlewares";
import { seal, defaults } from "@hapi/iron";
import { IncomingMessage, ServerResponse } from "http";
import { Socket } from "net";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import * as getAndPutUser from "@src/commands/get-and-put-user";
import { CONFIG_VARIABLES } from "@src/configs/config-variables";
import { oauth2Client } from "@src/configs/oauth2-client";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import refreshTokenHandler from "@src/pages/api/auth-connect/refresh-token";
import * as getDBUserFromSub from "@src/queries/get-db-user-from-sub";
import * as decryptVerifyAccessToken from "@src/workflows/decrypt-verify-access-token";

jest.mock("@src/configs/config-variables", () => {
  return {
    CONFIG_VARIABLES: {
      cookieSalt: "#*b+x3ZXE3-h[E+Q5YC5`jr~y%CA~R-[",
      connectOpenIdConfigurationUrl: "",
      connectApplicationClientId: "",
      connectApplicationClientSecret: "c9ab0fdc-b2dc-47ad-933b-87cf1b180ab5",
      connectAccountRedirectUri: "",
      connectAudience: "",
      connectApplicationScopes: "",
      connectProviderUrl: "http://foo.test",
      connectAccountURL: "http://foo.test",
      dynamoRegion: "eu-west-3",
    },
  };
});

jest.mock("@src/configs/rate-limiting-config.ts", () => {
  return {
    windowMs: 30000,
    requestsUntilBlock: 20,
  };
});

const spiedOnDecryptVerifyAccessToken = jest
  .spyOn(decryptVerifyAccessToken, "decryptVerifyAccessToken")
  .mockImplementation(async () => {
    return defaultPayload;
  });

const spiedOnGetDBUserFromSub = jest
  .spyOn(getDBUserFromSub, "getDBUserFromSub")
  .mockImplementation(async () => {
    return {
      sub: defaultPayload.sub,
      refresh_token: "refresh_token",
      temporary_identities: [],
      sudo: {
        sudo_mode_ttl: 42,
        sudo_event_ids: [],
      },
    };
  });

const spiedOnRefreshTokensFlow = jest
  .spyOn(oauth2Client, "refreshTokens")
  .mockImplementation(async () => {
    return {
      refresh_token: "new_refresh_token",
      access_token: "new_access_token",
    };
  });

const spiedOnGetAndPutUser = jest
  .spyOn(getAndPutUser, "getAndPutUser")
  .mockImplementation(async () => {
    return { $metadata: {} };
  });

async function sealJWS(access_token: string, salt?: string): Promise<string> {
  return seal(
    JSON.stringify({
      access_token,
      sub: "2a14bdd2-3628-4912-a76e-fd514b5c27a8",
    }),
    salt || CONFIG_VARIABLES.cookieSalt,
    defaults,
  );
}

function mockedReqAndRes(sealedJWE: string): {
  mockedNextApiRequest: NextApiRequest;
  mockedResponse: NextApiResponse;
} {
  const mockedRequest = new IncomingMessage(new Socket());
  const mockedResponse = new ServerResponse(mockedRequest) as NextApiResponse;

  const mockedNextApiRequest = Object.assign(mockedRequest, {
    query: {},
    cookies: {},
    body: null,
    env: {},
  });

  mockedNextApiRequest.headers = {
    cookie: `user-cookie=${sealedJWE}`,
    host: "http://localhost:4242/",
  };
  mockedNextApiRequest.rawHeaders = [
    "Cookie",
    `user-cookie=${sealedJWE}`,
    "host",
    "http://localhost:4242/",
  ];

  return { mockedNextApiRequest, mockedResponse };
}

const mockedHandler: Handler = async (
  _mockedNextApiRequest,
  _mockedResponse,
) => {
  return _mockedResponse.end();
};

describe("Authentication flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("auth-middleware", () => {
    test("should redirect to refresh token api endpoint and refresh the user tokens if a `TokenExpiredError` exception is thrown and a user is provided", async () => {
      expect.assertions(4);
      const access_token = generateHS256JWS({
        ...defaultPayload,
        exp: Date.now() - 3600000,
      });

      const sealedJWS = await sealJWS(access_token);

      const { mockedNextApiRequest, mockedResponse } =
        mockedReqAndRes(sealedJWS);

      mockedNextApiRequest.headers.referer = "http://referer.test/url";

      spiedOnDecryptVerifyAccessToken.mockImplementationOnce(async () => {
        class TokenExpiredError extends Error {
          name = "TokenExpiredError";
        }

        throw new TokenExpiredError();
      });

      const withAuthCallback = wrapMiddlewares(
        [authMiddleware(getTracer())],
        mockedHandler,
      );
      await withAuthCallback(mockedNextApiRequest, mockedResponse).catch(
        (error: WebError) => {
          expect(error).toBeInstanceOf(WebError);
          expect(error.message).toEqual("Temporary redirection");
          expect(error.httpStatus).toEqual(HttpStatus.TEMPORARY_REDIRECT);
        },
      );

      expect(spiedOnDecryptVerifyAccessToken).toHaveBeenCalled();
    });
  });

  describe("refresh-token endpoint", () => {
    test("should refresh tokens if a user is provided and redirect to last referrer URL", async () => {
      expect.assertions(4);

      const access_token = generateHS256JWS({
        ...defaultPayload,
        exp: Date.now() - 3600000,
      });

      const sealedJWS = await sealJWS(access_token);

      const { mockedNextApiRequest, mockedResponse } =
        mockedReqAndRes(sealedJWS);

      mockedNextApiRequest.url = "https://referer.test/url";
      mockedNextApiRequest.method = "GET";

      await refreshTokenHandler(mockedNextApiRequest, mockedResponse);

      expect(spiedOnGetDBUserFromSub).toHaveBeenCalled();
      expect(spiedOnRefreshTokensFlow).toHaveBeenCalled();
      expect(spiedOnDecryptVerifyAccessToken).toHaveBeenCalled();
      expect(spiedOnGetAndPutUser).toHaveBeenCalled();
    });
  });
});
