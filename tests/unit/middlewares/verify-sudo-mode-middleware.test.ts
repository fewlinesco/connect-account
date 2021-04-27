import { InMemoryTracer } from "@fwl/tracing";
import { IncomingMessage, ServerResponse } from "http";
import { Socket } from "net";
import { NextApiRequest, NextApiResponse } from "next";

import { verifySudoMode } from "@src/middlewares/verify-sudo-mode-middleware";
import * as query from "@src/workflows/get-user-from-cookie";

jest.mock("@src/workflows/get-user-from-cookie");

const mockedRequest = new IncomingMessage(new Socket());
const mockedResponse = new ServerResponse(mockedRequest) as NextApiResponse;

const mockedHandler = jest.fn();

describe("#Verify Sudo Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should return the redirection to the right page if the sudo ttl is too old", async () => {
    expect.assertions(2);
    jest.spyOn(query, "getUserFromCookie").mockImplementationOnce(() => {
      return Promise.resolve({
        sub: "fake-sub",
        refresh_token: "fake-token",
        temporary_identities: [],
        sudo: {
          sudo_mode_ttl: 0,
          sudo_event_ids: [],
        },
      });
    });

    const middleware = verifySudoMode(new InMemoryTracer(), "/fake-url");
    const handler = middleware(mockedHandler);
    const result = await handler(
      mockedRequest as NextApiRequest,
      mockedResponse,
    );

    expect(typeof result).toBe("object");
    expect(result.redirect.destination).toBe(
      "/account/security/sudo?next=/fake-url",
    );
  });

  it("Should return the handler if the sudo ttl is valid", async () => {
    expect.assertions(1);
    jest.spyOn(query, "getUserFromCookie").mockImplementationOnce(() => {
      return Promise.resolve({
        sub: "fake-sub",
        refresh_token: "fake-token",
        temporary_identities: [],
        sudo: {
          sudo_mode_ttl: Date.now() + 10,
          sudo_event_ids: [],
        },
      });
    });

    mockedHandler.mockImplementation(() => {
      const handlerHasBeenCalled = true;
      expect(handlerHasBeenCalled).toBe(true);
    });

    const middleware = verifySudoMode(new InMemoryTracer(), "/fake-url");
    const handler = middleware(mockedHandler);
    await handler(mockedRequest as NextApiRequest, mockedResponse);
  });
});
