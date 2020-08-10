import jwt from "jsonwebtoken";

export function promisifiedJWTVerify<T>(oauthData: {
  clientSecret?: string;
  accessToken: string;
}): Promise<{
  error: jwt.VerifyErrors | null;
  decoded: T;
}> {
  const { clientSecret, accessToken } = oauthData;

  return new Promise((resolve, reject) => {
    if (clientSecret) {
      jwt.verify(
        accessToken,
        clientSecret,
        (error: jwt.VerifyErrors | null, decoded: any) => {
          resolve({ error, decoded });
        },
      );
    } else {
      reject("Missing client_secret");
    }
  });
}
