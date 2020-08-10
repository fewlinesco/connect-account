import jwt from "jsonwebtoken";

import { promisifiedJWTVerify } from "../src/utils/promisifiedJWTVerify";

describe("promisifiedJWTVerify", () => {
  const mockedJWTPayload = {
    aud: ["yoga-community"],
    exp: Date.now(),
    iss: "foo",
    scope: "phone email",
    sub: "2a14bdd2-3628-4912-a76e-fd514b5c27a8",
  };

  const mockedClientSecret = "bar";

  const JWT = jwt.sign(mockedJWTPayload, mockedClientSecret);

  test("it should verify the JWT, and return it decoded", async () => {
    const decoded = await promisifiedJWTVerify<Record<string, unknown>>({
      clientSecret: mockedClientSecret,
      accessToken: JWT,
    });

    expect(decoded).not.toBe(undefined);
    expect(decoded).toEqual(expect.objectContaining(mockedJWTPayload));
  });

  test("it should throw an error is client secret us falsy", async () => {
    expect.assertions(1);

    await promisifiedJWTVerify<Record<string, unknown>>({
      clientSecret: undefined,
      accessToken: JWT,
    }).catch((error) => expect(error).toBe("Missing client_secret"));
  });
});
