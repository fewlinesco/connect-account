import { HttpStatus } from "@fwl/web";
import { IncomingMessage, ServerResponse } from "http";
import fetch, { enableFetchMocks } from "jest-fetch-mock";
import { Socket } from "net";
import { GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";

import { IdentityTypes } from "@lib/@types";
import { ProviderUser } from "@lib/@types";
import { getServerSideProps } from "@src/pages/account/logins/index";

enableFetchMocks();

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
    },
    oauth2Client: {
      verifyJWT: async () => {
        return {
          sub: "2a14bdd2-3628-4912-a76e-fd514b5c27a8",
        };
      },
      getAuthorizationURL: async () => {
        return "";
      },
    },
  };
});

jest.mock("@src/dbClient", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

const mockedRequest = new IncomingMessage(new Socket());

const mockedContext: GetServerSidePropsContext<ParsedUrlQuery> = {
  req: mockedRequest,
  res: new ServerResponse(mockedRequest),
  query: {},
  resolvedUrl: "",
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
              type: IdentityTypes.PHONE,
              value: "0123456789",
            },
            {
              id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
              primary: true,
              status: "validated",
              type: IdentityTypes.EMAIL,
              value: "test@test.test",
            },
          ],
        },
      },
    },
  };

  it("should redirect to the login flow if there are no session", async (done) => {
    expect.assertions(3);

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

    done();
  });
});
