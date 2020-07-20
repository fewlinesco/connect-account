import { IncomingMessage, ServerResponse } from "http";
import fetch from "jest-fetch-mock";
import { Socket } from "net";

import { getServerSideProps } from "../src/pages/index";

fetch.enableMocks();

describe("getServerSideProps", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  const mockedContext = {
    req: new IncomingMessage(new Socket()),
    res: new ServerResponse(new IncomingMessage(new Socket())),
    query: {},
  };

  it("should handle errors", async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: "error" }));

    const response = await getServerSideProps(mockedContext);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          fetchedData: {
            status: "error",
          },
        },
      }),
    );
  });

  it("should call api", async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: "success", data: "foo" }));

    const response = await getServerSideProps(mockedContext);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          fetchedData: {
            status: "success",
            data: "foo",
          },
        },
      }),
    );
  });
});
