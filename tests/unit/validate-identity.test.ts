import { HttpStatus } from "@fwl/web";
import fetch, { enableFetchMocks } from "jest-fetch-mock";

import { InvalidValidationCode, TemporaryIdentityExpired } from "@src/errors";
import * as fetchJson from "@src/utils/fetch-json";
import { validateIdentity } from "@src/workflows/validate-identity";

enableFetchMocks();

describe("validateIdentity unit test", () => {
  const mockedFetchJson = jest.spyOn(fetchJson, "fetchJson");

  beforeAll(() => {
    fetch.resetMocks();
  });

  it("should throw a new InvalidValidationCode error if validation code isn't valid", async () => {
    expect.assertions(2);

    const mockedFetchResponse = new Response(
      JSON.stringify({ code: "invalid_validation_code" }),
      {
        status: HttpStatus.BAD_REQUEST,
      },
    );

    mockedFetchJson.mockResolvedValueOnce(mockedFetchResponse);

    await expect(validateIdentity("000000", "1234")).rejects.toThrow(
      InvalidValidationCode,
    );
    expect(mockedFetchJson).toHaveBeenCalled();
  });

  it("should throw a new TemporaryIdentityExpired error if temporary identity is expired", async () => {
    expect.assertions(2);

    const mockedFetchResponse = new Response(
      JSON.stringify({ code: "temporary_identity_expired" }),
      {
        status: HttpStatus.BAD_REQUEST,
      },
    );

    mockedFetchJson.mockResolvedValueOnce(mockedFetchResponse);

    await expect(validateIdentity("000000", "1234")).rejects.toThrow(
      TemporaryIdentityExpired,
    );
    expect(mockedFetchJson).toHaveBeenCalled();
  });

  it("should return a new redirect path in string format when valdiation code is valid", async () => {
    expect.assertions(2);

    const mockedFetchResponse = new Response(null, {
      status: HttpStatus.OK,
    });

    Object.defineProperty(mockedFetchResponse, "url", {
      value: "https://localhost:29703/account/logins",
    });

    mockedFetchJson.mockResolvedValueOnce(mockedFetchResponse);

    const redirectPath = await validateIdentity("856729", "1234");

    expect(redirectPath).toEqual("/account/logins");
    expect(mockedFetchJson).toHaveBeenCalled();
  });
});
