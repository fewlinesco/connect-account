import FormData from "form-data";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default async (
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> => {
  if (request.method === "GET") {
    const callback = {
      client_id: process.env.API_CLIENT_ID,
      client_secret: process.env.API_CLIENT_SECRET,
      code: request.query.code as string,
      grant_type: "authorization_code",
      redirect_uri: process.env.API_REDIRECT_URI,
    };

    const formedPayload = new FormData();

    Object.entries(callback).forEach(
      ([key, value]) => value && formedPayload.append(key, value),
    );

    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] =
      process.env.NODE_ENV === "development" ? "0" : "1";

    await fetch(`${process.env.PROVIDER_URL}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(callback),
    })
      .then(async (response) => {
        const parsedResponse = await response.json();

        console.log(parsedResponse);

        if (callback.client_secret) {
          jwt.verify(
            parsedResponse.access_token,
            callback.client_secret,
            (error: jwt.VerifyErrors | null, decodedJwt?: unknown) => {
              if (error !== null) {
                throw new Error(error.message);
              }

              console.log(decodedJwt);
            },
          );

          return parsedResponse;
        }

        throw new Error("Missing client_secret");
      })
      .catch((error) => console.log(error));
  }

  response.statusCode = 405;

  return response.end();
};
