import jwt from "jsonwebtoken";

export function promisifiedJWTVerify<T>(oauthData: {
  clientSecret?: string;
  accessToken: string;
}): Promise<T> {
  const { clientSecret, accessToken } = oauthData;

  return new Promise((resolve, reject) => {
    if (clientSecret) {
      jwt.verify(
        accessToken,
        clientSecret,
        (error: jwt.VerifyErrors | null, decoded: any) => {
          return error ? reject(error) : resolve(decoded);
        },
      );
    } else {
      reject("Missing client_secret");
    }
  });
}
