import { IncomingMessage, ServerResponse } from "http";
import fetch from "jest-fetch-mock";
import { enableFetchMocks } from "jest-fetch-mock";
import { Socket } from "net";

import { getServerSideProps } from "../src/pages/index";

enableFetchMocks();

describe("getServerSideProps", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  const mockedContext = {
    req: new IncomingMessage(new Socket()),
    res: new ServerResponse(new IncomingMessage(new Socket())),
    query: {},
  };

  const mockedResponse = {
    data: {
      provider: {
        id: "4a5f8589-0d91-4a69-924a-6f227a69666d",
        name: "Mocked Provider",
        user: {
          id: "299d268e-3e19-4486-9be7-29c539d241ac",
          identities: [
            {
              primary: true,
              status: "validated",
              type: "phone",
              value: "0123456789",
            },
            {
              primary: true,
              status: "validated",
              type: "email",
              value: "test@test.test",
            },
          ],
        },
      },
    },
  };

  it("should call api", async () => {
    fetch.once(JSON.stringify(mockedResponse));

    const response = await getServerSideProps(mockedContext);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          fetchedData: mockedResponse,
        },
      }),
    );
  });
});
