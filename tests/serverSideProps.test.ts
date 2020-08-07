import { IncomingMessage, ServerResponse } from "http";
import fetch from "jest-fetch-mock";
import { enableFetchMocks } from "jest-fetch-mock";
import { Socket } from "net";

import { ReceivedIdentityTypes } from "../src/@types/Identity";
import { ProviderUser } from "../src/@types/ProviderUser";
import { getServerSideProps } from "../src/pages/index";

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
