import FormData from "form-data";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { Handler, Session } from "next-iron-session";
import withSession from "src/middleware/withSession";

interface ExtendedRequest extends NextApiRequest {
  session: Session;
}

const handler: Handler = async (
  request: ExtendedRequest,
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

        if (callback.client_secret) {
          jwt.verify(
            parsedResponse.access_token,
            callback.client_secret,
            (error: jwt.VerifyErrors | null) => {
              if (error !== null) {
                throw new Error(error.message);
              }

              request.session.set("user-jwt", parsedResponse.access_token);
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

export default withSession(handler);
