import { IncomingMessage, ServerResponse } from "http";
import fetch from "jest-fetch-mock";
import { enableFetchMocks } from "jest-fetch-mock";
import { Socket } from "net";

import { getServerSideProps } from "../src/pages/index";
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

  it("should call api", async () => {
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
