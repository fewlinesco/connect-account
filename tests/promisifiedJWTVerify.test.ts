import jwt from "jsonwebtoken";

import { promisifiedJWTVerify } from "../src/utils/promisifiedJWTVerify";

describe("promisifiedJWTVerify", () => {
  const mockedJWTPayload = {
    aud: ["connect-account"],
    exp: Date.now(),
    iss: "foo",
    scope: "phone email",
    sub: "2a14bdd2-3628-4912-a76e-fd514b5c27a8",
  };

  const mockedClientSecret = "bar";

  const JWT = jwt.sign(mockedJWTPayload, mockedClientSecret);

  test("it should verify the JWT, and return it decoded", async () => {
    const decoded = await promisifiedJWTVerify<Record<string, unknown>>(
      mockedClientSecret,
      JWT,
    );

    expect(decoded).not.toBe(undefined);
    expect(decoded).toEqual(expect.objectContaining(mockedJWTPayload));
  });

  test("it should throw an error if using a badly formed JWT", async () => {
    expect.assertions(1);

    await promisifiedJWTVerify<Record<string, unknown>>(
      mockedClientSecret,
      "",
    ).catch((error) => expect(error).toBeInstanceOf(jwt.JsonWebTokenError));
  });
});
