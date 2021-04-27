import { InMemoryTracer } from "@fwl/tracing";
import { IncomingMessage, ServerResponse } from "http";
import { Socket } from "net";
import { NextApiRequest, NextApiResponse } from "next";

import "@src/configs/config-variables";
import { verifySudoModeMiddleware } from "@src/middlewares/verify-sudo-mode-middleware";
import * as query from "@src/workflows/get-db-user-from-user-cookie";

jest.mock("@src/configs/config-variables", () => {
  return {
    configVariables: {
      cookieSalt: "#*b+x3ZXE3-h[E+Q5YC5`jr~y%CA~R-[",
      connectOpenIdConfigurationUrl: "",
      connectApplicationClientId: "",
      connectApplicationClientSecret: "c9ab0fdc-b2dc-47ad-933b-87cf1b180ab5",
      connectAccountRedirectUri: "",
      connectAudience: "",
      connectApplicationScopes: "",
      connectProviderUrl: "http://foo.test",
      connectAccountURL: "http://foo.test",
      dynamoRegion: "eu-west-3",
    },
  };
});

jest.mock("@src/workflows/get-db-user-from-user-cookie");

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

    const middleware = verifySudoModeMiddleware(
      new InMemoryTracer(),
      "/fake-url",
    );
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
    expect.assertions(2);
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

    const middleware = verifySudoModeMiddleware(
      new InMemoryTracer(),
      "/fake-url",
    );
    const handler = middleware(mockedHandler);
    const result = await handler(
      mockedRequest as NextApiRequest,
      mockedResponse,
    );
    expect(typeof result).not.toBe("object");
    expect(result).not.toBeDefined();
  });
});
