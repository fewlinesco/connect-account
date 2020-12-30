import { HttpStatus } from "@fwl/web";
import fetch, { enableFetchMocks } from "jest-fetch-mock";

import {
  InvalidValidationCode,
  TemporaryIdentityExpired,
} from "@src/clientErrors";
import { validateIdentity } from "@src/components/display/fewlines/ValidateIdentityForm/ValidateIdentityForm";
import * as fetchJson from "@src/utils/fetchJson";

enableFetchMocks();

describe("validateIdentity unit test", () => {
  const mockedFetchJson = jest.spyOn(fetchJson, "fetchJson");

  beforeAll(() => {
    fetch.resetMocks();
  });

  it("should throw a new InvalidValidationCode error if validation code isn't valid", async (done) => {
    expect.assertions(3);

    const mockedFetchResponse = new Response(
      JSON.stringify({ error: "INVALID" }),
      {
        status: HttpStatus.BAD_REQUEST,
      },
    );

    mockedFetchJson.mockResolvedValueOnce(mockedFetchResponse);

    const error = await validateIdentity("000000", "1234").catch((error) => {
      return error;
    });

    expect(mockedFetchJson).toHaveBeenCalled();
    expect(error).toBeInstanceOf(InvalidValidationCode);
    expect(error).not.toBeInstanceOf(TemporaryIdentityExpired);

    done();
  });

  it("should throw a new TemporaryIdentityExpired error if temporary identity is expired", async (done) => {
    expect.assertions(3);

    const mockedFetchResponse = new Response(
      JSON.stringify({ error: "Temporary Identity Expired" }),
      {
        status: HttpStatus.BAD_REQUEST,
      },
    );

    mockedFetchJson.mockResolvedValueOnce(mockedFetchResponse);

    const error = await validateIdentity("000000", "1234").catch((error) => {
      return error;
    });

    expect(mockedFetchJson).toHaveBeenCalled();
    expect(error).toBeInstanceOf(TemporaryIdentityExpired);
    expect(error).not.toBeInstanceOf(InvalidValidationCode);

    done();
  });

  it("should return a new redirect path in string format when valdiation code is valid", async (done) => {
    expect.assertions(2);

    const mockedFetchResponse = new Response(null, {
      status: HttpStatus.OK,
    });

    Object.defineProperty(mockedFetchResponse, "url", {
      value: "https://localhost:29703/account/logins",
    });

    mockedFetchJson.mockResolvedValueOnce(mockedFetchResponse);

    const redirectPath = await validateIdentity("856729", "1234").then(
      (path) => {
        return path;
      },
    );

    expect(mockedFetchJson).toHaveBeenCalled();
    expect(redirectPath).toEqual("/account/logins");

    done();
  });
});
