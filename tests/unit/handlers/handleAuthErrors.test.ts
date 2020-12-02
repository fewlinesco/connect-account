import { HttpStatus } from "@fwl/web";
import { IncomingMessage, ServerResponse } from "http";
import fetch from "jest-fetch-mock";
import { enableFetchMocks } from "jest-fetch-mock";
import { Socket } from "net";

import { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { handleAuthErrors } from "@src/handlers/handleAuthErrors";

enableFetchMocks();

const sub = "fe5bdd88-3c5b-4e7e-969b-9256323076c6";
const mockFunctionCalls = {
  getDBUserFromSub: 0,
  refreshTokensFlow: 0,
  verifyJWT: 0,
};

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
      verifyJWT: async () => {
        mockFunctionCalls.verifyJWT = +1;

        return {
          sub,
        };
      },
    },
  };
});

function mockedReqAndRes(): {
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

  return { mockedExtendedRequest, mockedResponse };
}

describe("handleAuthErrors", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  beforeEach(() => {
    mockFunctionCalls.getDBUserFromSub = 0;
    mockFunctionCalls.refreshTokensFlow = 0;
    mockFunctionCalls.verifyJWT = 0;
  });

  describe("Refresh tokens", () => {
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

      const { mockedExtendedRequest, mockedResponse } = mockedReqAndRes();

      await handleAuthErrors(
        mockedExtendedRequest,
        mockedResponse,
        mockedException,
        sub,
      );

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

      const { mockedExtendedRequest, mockedResponse } = mockedReqAndRes();
      const mockedException = new Error("TokenExpiredError");

      await handleAuthErrors(
        mockedExtendedRequest,
        mockedResponse,
        mockedException,
        sub,
      );

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
