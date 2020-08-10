import { IncomingMessage, ServerResponse } from "http";
import fetch from "jest-fetch-mock";
import { enableFetchMocks } from "jest-fetch-mock";
import jwt from "jsonwebtoken";
import { Socket } from "net";

import { getServerSideProps } from "../src/pages/account";
import {
  mockedSortedResponse,
  mockedResponse,
} from "./__mocks__/managementResponse";

enableFetchMocks();

describe("getServerSideProps", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  afterEach(() => {
    mockedContext.req.headers = {};

    mockedContext.req.rawHeaders = [];
  });

  const mockedRequest = new IncomingMessage(new Socket());

  const mockedContext = {
    req: mockedRequest,
    res: new ServerResponse(mockedRequest),
    query: {},
  };

  const mockedJWTPayload = {
    aud: ["yoga-community"],
    exp: Date.now(),
    iss: process.env.PROVIDER_ISS,
    scope: "phone email",
    sub: "2a14bdd2-3628-4912-a76e-fd514b5c27a8",
  };

  const mockedClientSecret = "foo";

  const JWT = jwt.sign(mockedJWTPayload, mockedClientSecret);

  it("should redirect to the login flow if there are no session", async () => {
    fetch.once(JSON.stringify(mockedResponse));

    const response = await getServerSideProps(mockedContext);

    expect(mockedContext.res.statusCode).toEqual(302);

    const redirectLocation = mockedContext.res.getHeader("location");

    expect(redirectLocation).toBe("/");

    expect(response).toEqual(
      expect.objectContaining({
        props: {},
      }),
    );
  });

  it("should get the user-id from the session and call management GraphQL endpoint", async () => {
    mockedContext.req.headers = {
      cookie: JWT,
    };

    mockedContext.req.rawHeaders = ["Cookie", JWT];

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
