import { HttpStatus } from "@fwl/web";
import { seal, defaults } from "@hapi/iron";
import { IncomingMessage, ServerResponse } from "http";
import fetch from "jest-fetch-mock";
import { enableFetchMocks } from "jest-fetch-mock";
import jwt from "jsonwebtoken";
import { Socket } from "net";
import { OAuth2Errors } from "src/@types/OAuth2Errors";

import { ReceivedIdentityTypes } from "../src/@types/Identity";
import { ProviderUser } from "../src/@types/ProviderUser";
import { config, oauth2Client } from "../src/config";
import { OAuth2Error } from "../src/errors";
import { getServerSideProps } from "../src/pages/account/logins/index";

enableFetchMocks();

jest.mock("../src/config", () => {
  return {
    config: {
      connectAccountSessionSalt: "#*b+x3ZXE3-h[E+Q5YC5`jr~y%CA~R-[",
      connectOpenIdConfigurationUrl: "",
      connectApplicationClientId: "",
      connectApplicationClientSecret: "foo-bar",
      connectRedirectUri: "",
      connectAudience: "",
      connectApplicationScopes: "",
    },
    oauth2Client: {
      verifyJWT: jest.fn(),
    },
  };
});

// jest.mock("../src/config", () => {
//   return {
//     config: {
//       connectAccountSessionSalt: "#*b+x3ZXE3-h[E+Q5YC5`jr~y%CA~R-[",
//       connectOpenIdConfigurationUrl: "",
//       connectApplicationClientId: "",
//       connectApplicationClientSecret: "foo-bar",
//       connectRedirectUri: "",
//       connectAudience: "",
//       connectApplicationScopes: "",
//     },
//     oauth2Client: {
//       verifyJWT: async () => {
//         return {
//           sub: "2a14bdd2-3628-4912-a76e-fd514b5c27a8",
//         };
//       },
//     },
//   };
// });

const mockedRequest = new IncomingMessage(new Socket());

const mockedContext = {
  req: mockedRequest,
  res: new ServerResponse(mockedRequest),
  query: {},
};

const mockedJWTPayload = {
  aud: ["connect-account"],
  exp: Date.now(),
  iss: "foo",
  scope: "phone email",
  sub: "2a14bdd2-3628-4912-a76e-fd514b5c27a8",
};

describe("getServerSideProps", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  beforeEach(() => {
    mockedContext.req.headers = {};
    mockedContext.req.rawHeaders = [];
  });

  const mockedResponse: { data: { provider: ProviderUser } } = {
    data: {
      provider: {
        id: "4a5f8589-0d91-4a69-924a-6f227a69666d",
        name: "Mocked Provider",
        user: {
          id: "299d268e-3e19-4486-9be7-29c539d241ac",
          identities: [
            {
              id: "7f8d168a-3f65-4636-9acb-7720a212680e",
              primary: true,
              status: "validated",
              type: ReceivedIdentityTypes.PHONE,
              value: "0123456789",
            },
            {
              id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
              primary: true,
              status: "validated",
              type: ReceivedIdentityTypes.EMAIL,
              value: "test@test.test",
            },
          ],
        },
      },
    },
  };

  it("should redirect to the login flow if there are no session", async () => {
    fetch.once(JSON.stringify(mockedResponse));

    const response = await getServerSideProps(mockedContext);

    expect(mockedContext.res.statusCode).toEqual(HttpStatus.TEMPORARY_REDIRECT);

    const redirectLocation = mockedContext.res.getHeader("location");

    expect(redirectLocation).toBe("/");

    expect(response).toEqual(
      expect.objectContaining({
        props: {},
      }),
    );
  });

  it("should get the user-id from the session and call management GraphQL endpoint", async () => {
    const mockedSortedResponse = {
      emailIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
          status: "validated",
          type: ReceivedIdentityTypes.EMAIL,
          value: "test@test.test",
        },
      ],
      phoneIdentities: [
        {
          id: "7f8d168a-3f65-4636-9acb-7720a212680e",
          primary: true,
          status: "validated",
          type: ReceivedIdentityTypes.PHONE,
          value: "0123456789",
        },
      ],
    };

    const JWT = jwt.sign(
      mockedJWTPayload,
      config.connectApplicationClientSecret,
    );

    const sealedJWT = await seal(
      {
        persistent: {
          "user-jwt": JWT,
        },
        flash: {},
      },
      config.connectAccountSessionSalt,
      defaults,
    );

    mockedContext.req.headers = {
      cookie: `connect-account-session=${sealedJWT}`,
    };

    mockedContext.req.rawHeaders = [
      "Cookie",
      `connect-account-session=${sealedJWT}`,
    ];

    fetch.once(JSON.stringify(mockedResponse));

    const response = await getServerSideProps(mockedContext);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          sortedIdentities: mockedSortedResponse,
        },
      }),
    );
  });
});
