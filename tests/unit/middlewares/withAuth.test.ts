import { defaultPayload, generateHS256JWS } from "@fwl/oauth2";
import { HttpStatus } from "@fwl/web";
import { seal, defaults } from "@hapi/iron";
import { IncomingMessage, ServerResponse } from "http";
import fetch from "jest-fetch-mock";
import { enableFetchMocks } from "jest-fetch-mock";
import { Socket } from "net";

import * as refreshTokensFlow from "@lib/commands/refreshTokensFlow";
import { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { Handler } from "@src/@types/core/Handler";
import * as getAndPutUser from "@src/commands/getAndPutUser";
import { config } from "@src/config";
import { withAuth } from "@src/middlewares/withAuth";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewares } from "@src/middlewares/wrapper";
import * as getDBUserFromSub from "@src/queries/getDBUserFromSub.ts";
import * as decryptVerifyAccessToken from "@src/workflows/decryptVerifyAccessToken";

enableFetchMocks();

const mockFunctionCalls = {
  getDBUserFromSub: 0,
  refreshTokensFlow: 0,
  verifyJWT: 0,
};

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

jest.mock("@lib/commands/refreshTokensFlow.ts", () => {
  return {
    refreshTokensFlow: () => {
      mockFunctionCalls.refreshTokensFlow += 1;

      return {
        refresh_token: "new_refresh_token",
        access_token: "new_access_token",
      };
    },
  };
});

jest.mock("@src/config", () => {
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
    oauth2Client: {
      verifyJWT: async () => {
        mockFunctionCalls.verifyJWT = +1;

        return {
          sub: "8b1e8a9c-2092-4bcf-b1c5-9d36b3e43640",
        };
      },
    },
  };
});

async function sealJWS(access_token: string, salt?: string): Promise<string> {
  return seal(
    {
      persistent: {
        "user-session": {
          access_token,
          sub: "8b1e8a9c-2092-4bcf-b1c5-9d36b3e43640",
        },
      },
      flash: {},
    },
    salt ? salt : config.connectAccountSessionSalt,
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
    cookie: `connect-account-session=${sealedJWE}`,
  };
  mockedExtendedRequest.rawHeaders = [
    "Cookie",
    `connect-account-session=${sealedJWE}`,
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
    fetch.resetMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    mockFunctionCalls.getDBUserFromSub = 0;
    mockFunctionCalls.refreshTokensFlow = 0;
    mockFunctionCalls.verifyJWT = 0;
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
    test.only("should redirect to the login flow if a `TokenExpiredError` exception is thrown and no user is provided", async (done) => {
      expect.assertions(6);

      const access_token = generateHS256JWS({
        ...defaultPayload,
        exp: Date.now() - 3600,
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

      spiedOnGetDBUserFromSub.mockImplementation(async () => {
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
      expect(spiedOnGetAndPutUser).not.toHaveBeenCalled();
      expect(mockedResponse.statusCode).toEqual(HttpStatus.TEMPORARY_REDIRECT);
      expect(mockedResponse.getHeader("location")).toBe("/");

      done();
    });

    test("should refresh the user tokens if a `TokenExpiredError` exception is thrown and a user is provided, and should not redirect", async (done) => {
      expect.assertions(5);

      const access_token = generateHS256JWS({
        ...defaultPayload,
        exp: Date.now() - 3600,
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

      const withAuthCallback = wrapMiddlewares(
        [withSession, withAuth],
        mockedHandler,
      );
      await withAuthCallback(mockedExtendedRequest, mockedResponse);
      // .catch(
      //   () => {
      //     expect(spiedOnDecryptVerifyAccessToken).toHaveBeenCalled();
      //     expect(spiedOnGetDBUserFromSub).toHaveBeenCalled();
      //     expect(spiedOnRefreshTokensFlow).toHaveBeenCalled();
      //     expect(spiedOnGetAndPutUser).toHaveBeenCalled();
      //     expect(mockedResponse.statusCode).toEqual(HttpStatus.OK);
      //   },
      // );

      expect(spiedOnDecryptVerifyAccessToken).toHaveBeenCalled();
      expect(spiedOnGetDBUserFromSub).toHaveBeenCalled();
      expect(spiedOnRefreshTokensFlow).toHaveBeenCalled();
      expect(spiedOnGetAndPutUser).toHaveBeenCalled();
      expect(mockedResponse.statusCode).toEqual(HttpStatus.OK);

      done();
    });
  });
});
