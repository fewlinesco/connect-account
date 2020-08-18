import { HttpStatus } from "@fewlines/fwl-web";
import { seal, defaults } from "@hapi/iron";
import { IncomingMessage, ServerResponse } from "http";
import fetch from "jest-fetch-mock";
import { enableFetchMocks } from "jest-fetch-mock";
import jwt from "jsonwebtoken";
import { Socket } from "net";

import { config } from "../src/config";
import { getServerSideProps } from "../src/pages/account";
import {
  mockedSortedResponse,
  mockedResponse,
} from "./__mocks__/managementResponse";

enableFetchMocks();

jest.mock("../src/config", () => {
  return {
    config: {
      connectApplicationClientSecret: "foo-bar",
      connectAccountSessionSalt: "#*b+x3ZXE3-h[E+Q5YC5`jr~y%CA~R-[",
    },
  };
});

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
