import jwt from "jsonwebtoken";

export function promisifiedJWTVerify<T>(
  clientSecret: string,
  accessToken: string,
): Promise<T> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      accessToken,
      clientSecret,
      (error: jwt.VerifyErrors | null, decoded: any) => {
        return error ? reject(error) : resolve(decoded);
      },
    );
  });
}
