import { oauth2Client } from "@src/config";
import { decryptVerifyAccessToken } from "@src/workflows/decryptVerifyAccessToken";

const mockedExpirationDate = Date.now() + 300;

jest.mock("@src/config.ts", () => {
  return {
    config: {
      connectJwePrivateKey: "foo-bar",
      connectJwtAlgorithm: "RS256",
      connectIsAccessTokenSigned: "false",
    },
    oauth2Client: {
      verifyJWT: async () => {
        return {
          aud: ["connect-account"],
          exp: mockedExpirationDate,
          iss: "foo",
          scope: "phone email",
          sub: "2a14bdd2-3628-4912-a76e-fd514b5c27a8",
        };
      },
      decryptJWE: async () => {
        return {
          aud: ["connect-account"],
          exp: mockedExpirationDate,
          iss: "foo",
          scope: "phone email",
          sub: "2a14bdd2-3628-4912-a76e-fd514b5c27a8",
        };
      },
    },
  };
});

describe("decryptVerifyAccessToken", () => {
  const mockVerifyJWT = jest.spyOn(oauth2Client, "verifyJWT");
  const mockDecryptJWE = jest.spyOn(oauth2Client, "decryptJWE");

  test("should return a verified access token if provided a JWS", async (done) => {
    expect.assertions(3);

    const expectedAccessToken = {
      aud: ["connect-account"],
      exp: mockedExpirationDate,
      iss: "foo",
      scope: "phone email",
      sub: "2a14bdd2-3628-4912-a76e-fd514b5c27a8",
    };

    const RS256JWT =
      "eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ2NTEyZjUzLTk3NzQtNGE1OC04MzBjLTk4MTg4NmM4YmI0MyIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiY29ubmVjdC1hY2NvdW50Il0sImV4cCI6MjUyNDY1MTIwMCwiaXNzIjoiaHR0cHM6Ly9icy1wcm92aWRlci5wcm9kLmNvbm5lY3QuY29ubmVjdC5hd3MuZXUtd2VzdC0yLms4cy5mZXdsaW5lcy5uZXQiLCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJzdWIiOiJjNGIxY2I1OS0xYzUwLTQ5NGEtODdlNS0zMmE1ZmU2ZTdjYWEifQ.dRw3QknDU9KOQR44tKLYkkasQvUenN3dbBai2f7omSpf1NCYSorisVpKUhS6luyhtZhL5H8q8oY95WlfU7XEdMk4iW9-VGlrWCVhD-NDdFC2nc_drz9aJm_tZDY-NL5l63PJuRchFmPuKEoehAQ6ZJfK63o_0VsutCQAOpqSocI";

    const verifiedToken = await decryptVerifyAccessToken(RS256JWT);

    expect(mockVerifyJWT).toHaveBeenCalled();
    expect(mockDecryptJWE).not.toHaveBeenCalled();
    expect(verifiedToken).toMatchObject(expectedAccessToken);

    done();
  });

  test("should return a decoded access token if provided a non-signed JWE", async (done) => {
    expect.assertions(3);

    const expectedAccessToken = {
      aud: ["connect-account"],
      exp: mockedExpirationDate,
      iss: "foo",
      scope: "phone email",
      sub: "2a14bdd2-3628-4912-a76e-fd514b5c27a8",
    };

    const nonSignedJWE =
      "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMTI4R0NNIn0.w4eo3k66Kr20CVrUQYDCgIR9ZFTFmbdtHvCGEGEYqQt3xJKo1zDT8nrkApHBTWgpg09BrvToBcHYhpZSCV9dbMSzjPWvjNlQTr5f7lOQ4Q34MQaCmH3LWr5toCYGl9iXJLolpW-r9vQNuwJIoYIinycXYJMCMgT72miKbHC66qJf1YoOgOqC9fc8E4V79fYuAaLmalEncqJHTn_u67e5qEZNqRrgFlxd4b9IPhMuRmaP3OICvtSFBIuFH64gVke6ckOwK-mGIIA-qQzwgkZrWnddmIMWKhSR7CwtXzKY46alHJrN1pvaAHBVqHCKi3JtBL_sCtpVZXHfCmhBqWcW2A.vxelVyonD7vTWBYX.yz7wOYxlwTRGeuABqlQ110Sw28nFsHjBig9kwyGFz4D6fqjrY_6mM2fYBZDbPuviumQifJ3vDvilV4dkIXJ9csSEgLlaLOK043kpT2T-2_XFnxdG7sfBHRimsg_ag889OjdZiGT4hMK-K_0lyZ8dOTHgcRMpLApX_s8Cog.kxPk7co7dttJ9l9ZrKxV9g";

    const decodedToken = await decryptVerifyAccessToken(nonSignedJWE);

    expect(mockVerifyJWT).not.toHaveBeenCalled();
    expect(mockDecryptJWE).toHaveBeenCalled();
    expect(decodedToken).toMatchObject(expectedAccessToken);

    done();
  });
});
/**
 * - JWS -> JWT
 * - JWE -> JWT
 * - JWE -> JWS -> JWT
 *
 * - env var -> boolean
 * - string !== 3 / 5 parts
 */
