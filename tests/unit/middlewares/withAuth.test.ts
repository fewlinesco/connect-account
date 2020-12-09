import { HttpStatus } from "@fwl/web";
import { seal, defaults } from "@hapi/iron";
import { IncomingMessage, ServerResponse } from "http";
import fetch from "jest-fetch-mock";
import { enableFetchMocks } from "jest-fetch-mock";
import { Socket } from "net";

import { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { Handler } from "@src/@types/core/Handler";
import { config } from "@src/config";
import { withAuth } from "@src/middlewares/withAuth";
import * as getDBUserFromSub from "@src/queries/getDBUserFromSub.ts";

enableFetchMocks();

const sub = "fe5bdd88-3c5b-4e7e-969b-9256323076c6";
const mockFunctionCalls = {
  getDBUserFromSub: 0,
  refreshTokensFlow: 0,
  verifyJWT: 0,
};

const spyedOnGetDBUserFromSub = jest
  .spyOn(getDBUserFromSub, "getDBUserFromSub")
  .mockImplementation(async () => {
    return {
      sub,
      refresh_token: "refresh_token",
      temporary_identities: [],
    };
  });

jest.mock("@src/queries/getDBUserFromSub.ts", () => {
  return {
    getDBUserFromSub: () => {
      mockFunctionCalls.getDBUserFromSub = +1;

      return {
        sub,
        refresh_token: "refresh_token",
        temporary_identities: [],
      };
    },
  };
});

jest.mock("@lib/commands/refreshTokensFlow.ts", () => {
  return {
    refreshTokensFlow: () => {
      mockFunctionCalls.refreshTokensFlow = +1;

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
      connectApplicationClientSecret: "foo-bar",
      connectAccountRedirectUri: "",
      connectAudience: "",
      connectApplicationScopes: "",
      connectProviderUrl: "http://foo.test",
      connectAccountURL: "http://foo.test",
      dynamoRegion: "eu-west-3",
    },
    oauth2Client: {
      verifyJWT: jest.fn(),
    },
    // oauth2Client: {
    //   verifyJWT: async () => {
    //     mockFunctionCalls.verifyJWT = +1;

    //     return {
    //       sub,
    //     };
    //   },
    // },
  };
});

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
  return Promise.resolve();
};

describe("handleAuthErrors", () => {
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

  describe("Refresh tokens", () => {
    // remove
    const mockedException = new Error();
    mockedException.message = "TokenExpiredError";

    it("should redirect to the login flow if a `TokenExpiredError` exception is thrown and no user is provided", async (done) => {
      expect.assertions(2);

      jest.mock("@src/queries/getDBUserFromSub.ts", () => {
        return {
          getDBUserFromSub: () => {
            mockFunctionCalls.getDBUserFromSub = +1;

            return null;
          },
        };
      });

      const validJWTPayload = {
        aud: ["connect-account"],
        exp: Date.now() + 3600,
        iss: "foo",
        scope: "phone email",
        sub: "2a14bdd2-3628-4912-a76e-fd514b5c27a8",
      };

      const access_token = jwt.sign(validJWTPayload, privateKey, {
        algorithm: "RS256",
      });

      const sealedJWT = await seal(
        {
          persistent: {
            "user-session": {
              access_token,
              sub,
            },
          },
          flash: {},
        },
        config.connectAccountSessionSalt,
        defaults,
      );

      const { mockedExtendedRequest, mockedResponse } = mockedReqAndRes(
        sealedJWT,
      );

      withAuth(await mockedHandler(mockedExtendedRequest, mockedResponse));

      const expectedFunctionCalls = {
        getDBUserFromSub: 1,
        refreshTokensFlow: 0,
        verifyJWT: 0,
      };

      expect(mockFunctionCalls).toMatchObject(expectedFunctionCalls);
      expect(mockedResponse.statusCode).toEqual(HttpStatus.TEMPORARY_REDIRECT);

      done();
    });

    it("should refresh the user tokens if a `TokenExpiredError` exception is thrown and a user is provided, and should not redirect", async (done) => {
      expect.assertions(2);

      const expiredJWTPayload = {
        aud: ["connect-account"],
        exp: Date.now() - 3600,
        iss: "foo",
        scope: "phone email",
        sub: "2a14bdd2-3628-4912-a76e-fd514b5c27a8",
      };

      const access_token = jwt.sign(expiredJWTPayload, privateKey, {
        algorithm: "RS256",
      });

      const sealedJWT = await seal(
        {
          persistent: {
            "user-session": {
              access_token,
              sub,
            },
          },
          flash: {},
        },
        config.connectAccountSessionSalt,
        defaults,
      );

      const { mockedExtendedRequest, mockedResponse } = mockedReqAndRes(
        sealedJWT,
      );

      withAuth(await mockedHandler(mockedExtendedRequest, mockedResponse));

      const expectedFunctionCalls = {
        getDBUserFromSub: 1,
        refreshTokensFlow: 1,
        verifyJWT: 1,
      };

      expect(mockFunctionCalls).toMatchObject(expectedFunctionCalls);
      expect(mockedResponse.statusCode).toEqual(HttpStatus.OK);

      done();
    });
  });
});
