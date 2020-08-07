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

  const mockedRequest = new IncomingMessage(new Socket());

  const mockedContext = {
    req: mockedRequest,
    res: new ServerResponse(mockedRequest),
    query: {},
  };

  mockedContext.req.headers = {
    cookie: process.env.MOCKED_JWT,
  };

  mockedContext.req.rawHeaders = process.env.MOCKED_JWT
    ? ["Cookie", process.env.MOCKED_JWT]
    : [];

  it("should call get the userId from the session and call management", async () => {
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

  // it("should redirect to the login flow if there are no session", async () => {
  //   fetch.once(JSON.stringify(mockedResponse));

  //   const response = await getServerSideProps(mockedContext);

  //   expect(response).toEqual(
  //     expect.objectContaining({
  //       props: {},
  //     }),
  //   );
  // });
});
