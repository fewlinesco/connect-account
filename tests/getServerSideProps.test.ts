import { IncomingMessage, ServerResponse } from "http";
import fetch from "jest-fetch-mock";
import { enableFetchMocks } from "jest-fetch-mock";
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

  const JWT =
    "oauth-jwt=Fe26.2*1*9e97d90b116ba826f0afd3fa1a4fc4f1cbb4e60d4186fd86655dee7570c815c1*3LJtUjnN1DDMcLbVjsYqug*D6L2Os0U4SBpnKiVtR9PKahMrhsWHdVrRQXsUVI7NqAWPynSrklF47cZOs_YVu2D7JjJl5RzjmcRoDzoR6i88uFeutGopX6enFUZ-r8t04s*1596806055744*7c7e27e418cef5124616b230b49775f11c450f3eb95144f00be254abf2c2d24c*IUj8Kh_m9b1wdkGqs1nB6Gsl-VYL5DiVuZaGioAVoqk";

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
