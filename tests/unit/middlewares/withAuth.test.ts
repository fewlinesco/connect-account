import { defaultPayload, generateHS256JWS } from "@fwl/oauth2";
import { HttpStatus } from "@fwl/web";
import { seal, defaults } from "@hapi/iron";
import { IncomingMessage, ServerResponse } from "http";
import { Socket } from "net";

import * as refreshTokensFlow from "@lib/commands/refreshTokensFlow";
import { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { Handler } from "@src/@types/core/Handler";
import * as getAndPutUser from "@src/commands/getAndPutUser";
import { config, oauth2Client } from "@src/config";
import { withAuth } from "@src/middlewares/withAuth";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewares } from "@src/middlewares/wrapper";
import * as getDBUserFromSub from "@src/queries/getDBUserFromSub.ts";
import * as decryptVerifyAccessToken from "@src/workflows/decryptVerifyAccessToken";

jest.mock("@src/config", () => {
  const configFile = jest.requireActual("@src/config");

  return {
    config: {
      connectAccountSessionSalt: "#*b+x3ZXE3-h[E+Q5YC5`jr~y%CA~R-[",
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
    oauth2Client: configFile.oauth2Client,
  };
});

const spiedOnVerifyJWT = jest
  .spyOn(oauth2Client, "verifyJWT")
  .mockImplementation(async () => {
    return {
      sub: "2a14bdd2-3628-4912-a76e-fd514b5c27a8",
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
    };
  });

const spiedOnRefreshTokensFlow = jest
  .spyOn(refreshTokensFlow, "refreshTokensFlow")
  .mockImplementation(async () => {
    return {
      refresh_token: "new_refresh_token",
      access_token: "new_access_token",
    };
  });

const spiedOnGetAndPutUser = jest
  .spyOn(getAndPutUser, "getAndPutUser")
  .mockImplementation(async () => {
    return;
  });

async function sealJWS(access_token: string, salt?: string): Promise<string> {
  return seal(
    {
      persistent: {
        "user-cookie": {
          access_token,
          sub: "2a14bdd2-3628-4912-a76e-fd514b5c27a8",
        },
      },
      flash: {},
    },
    salt || config.connectAccountSessionSalt,
    defaults,
  );
}

function mockedReqAndRes(
  sealedJWE: string,
): {
  mockedExtendedRequest: ExtendedRequest;
  mockedResponse: ServerResponse;
} {
  const mockedRequest = new IncomingMessage(new Socket());
  const mockedResponse = new ServerResponse(mockedRequest);

  const mockedSession = {
    set: () => {
      return;
    },
    get: () => {
      return undefined;
    },
    unset: () => {
      return;
    },
    destroy: () => {
      return;
    },
    save: async () => {
      return;
    },
  };

  const mockedExtendedRequest = Object.assign(mockedRequest, {
    session: mockedSession,
    query: {},
    cookies: {},
    body: null,
    env: {},
  });

  mockedExtendedRequest.headers = {
    cookie: `connect-account-cookie=${sealedJWE}`,
  };
  mockedExtendedRequest.rawHeaders = [
    "Cookie",
    `connect-account-cookie=${sealedJWE}`,
  ];

  return { mockedExtendedRequest, mockedResponse };
}

const mockedHandler: Handler = async (
  _mockedExtendedRequest,
  _mockedResponse,
) => {
  return _mockedResponse.end();
};

describe("withAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should redirect to the login flow if no UserCookie is provided", async (done) => {
    expect.assertions(2);

    const access_token = generateHS256JWS();
    const sealedJWS = await sealJWS(
      access_token,
      "thisIsAWrongSaltToMakeUserCookieUndefined",
    );

    const { mockedExtendedRequest, mockedResponse } = mockedReqAndRes(
      sealedJWS,
    );

    const withAuthCallback = wrapMiddlewares(
      [withSession, withAuth],
      mockedHandler,
    );
    await withAuthCallback(mockedExtendedRequest, mockedResponse);

    expect(mockedResponse.statusCode).toEqual(HttpStatus.TEMPORARY_REDIRECT);
    expect(spiedOnDecryptVerifyAccessToken).not.toHaveBeenCalled();

    done();
  });

  describe("Refresh tokens", () => {
    test("should redirect to the login flow if a `TokenExpiredError` exception is thrown and no user is provided", async (done) => {
      expect.assertions(7);

      const access_token = generateHS256JWS({
        ...defaultPayload,
        exp: Date.now() - 3600000,
      });

      const sealedJWS = await sealJWS(access_token);

      const { mockedExtendedRequest, mockedResponse } = mockedReqAndRes(
        sealedJWS,
      );

      spiedOnDecryptVerifyAccessToken.mockImplementationOnce(async () => {
        class TokenExpiredError extends Error {
          name = "TokenExpiredError";
        }

        throw new TokenExpiredError();
      });

      spiedOnGetDBUserFromSub.mockImplementationOnce(async () => {
        return null;
      });

      const withAuthCallback = wrapMiddlewares(
        [withSession, withAuth],
        mockedHandler,
      );
      await withAuthCallback(mockedExtendedRequest, mockedResponse);

      expect(spiedOnDecryptVerifyAccessToken).toHaveBeenCalled();
      expect(spiedOnGetDBUserFromSub).toHaveBeenCalled();
      expect(spiedOnRefreshTokensFlow).not.toHaveBeenCalled();
      expect(spiedOnVerifyJWT).not.toHaveBeenCalled();
      expect(spiedOnGetAndPutUser).not.toHaveBeenCalled();
      expect(mockedResponse.statusCode).toEqual(HttpStatus.TEMPORARY_REDIRECT);
      expect(mockedResponse.getHeader("location")).toBe("/");

      done();
    });

    test("should refresh the user tokens if a `TokenExpiredError` exception is thrown and a user is provided, and should not redirect", async (done) => {
      expect.assertions(7);

      const access_token = generateHS256JWS({
        ...defaultPayload,
        exp: Date.now() - 3600000,
      });

      const sealedJWS = await sealJWS(access_token);

      const { mockedExtendedRequest, mockedResponse } = mockedReqAndRes(
        sealedJWS,
      );

      mockedExtendedRequest.headers.referer = "referer/url";

      spiedOnDecryptVerifyAccessToken.mockImplementationOnce(async () => {
        class TokenExpiredError extends Error {
          name = "TokenExpiredError";
        }

        throw new TokenExpiredError();
      });

      const withAuthCallback = wrapMiddlewares(
        [withSession, withAuth],
        mockedHandler,
      );
      await withAuthCallback(mockedExtendedRequest, mockedResponse);

      expect(spiedOnDecryptVerifyAccessToken).toHaveBeenCalled();
      expect(spiedOnGetDBUserFromSub).toHaveBeenCalled();
      expect(spiedOnRefreshTokensFlow).toHaveBeenCalled();
      expect(spiedOnVerifyJWT).toHaveBeenCalled();
      expect(spiedOnGetAndPutUser).toHaveBeenCalled();
      expect(mockedResponse.statusCode).toEqual(HttpStatus.OK);
      expect(mockedResponse.getHeader("location")).toBe("referer/url");

      done();
    });
  });
});
