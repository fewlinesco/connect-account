import { AccessToken } from "@src/@types/oauth2/OAuth2Tokens";
import { oauth2Client } from "@src/config";
import { decryptVerifyAccessToken } from "@src/workflows/decryptVerifyAccessToken";

describe("decryptVerifyAccessToken", () => {
  jest.mock("@src/config.ts", () => {
    return {
      config: {
        connectJwePrivateKey: "foo-bar",
        connectJwtAlgorithm: "RS256",
        connectIsAccessTokenSigned: "true",
      },
    };
  });

  const expirationDate = Date.now() + 300;

  const mockVerifyJWT = jest
    .spyOn(oauth2Client, "verifyJWT")
    .mockImplementation(
      async (): Promise<AccessToken> => {
        return {
          aud: ["connect-account"],
          exp: expirationDate,
          iss: "foo",
          scope: "phone email",
          sub: "2a14bdd2-3628-4912-a76e-fd514b5c27a8",
        };
      },
    );
  const mockDecryptJWE = jest.spyOn(oauth2Client, "decryptJWE");

  test("should return a verified access token if provided a JWS", async (done) => {
    expect.assertions(3);

    const expectedAccessToken = {
      aud: ["connect-account"],
      exp: expirationDate,
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
});
/**
 * - JWS -> JWT
 * - JWE -> JWT
 * - JWE -> JWS -> JWT
 *
 * - env var -> boolean
 * - string !== 3 / 5 parts
 */
