import jwt from "jsonwebtoken";
import { NextApiResponse } from "next";
import { Handler } from "next-iron-session";
import { ExtendedRequest } from "src/@types/ExtendedRequest";
import withSession from "src/middleware/withSession";

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

    await fetch(`${process.env.PROVIDER_URL}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(callback),
    })
      .then(async (fetchedResponse) => {
        const parsedResponse = await fetchedResponse.json();

        if (callback.client_secret) {
          // promissifier
          jwt.verify(
            parsedResponse.access_token,
            callback.client_secret,
            async (error: jwt.VerifyErrors | null, decoded?: any) => {
              if (error !== null) {
                throw new Error(error.message);
              }

              request.session.set("user-id", decoded.sub);

              await request.session.save().catch((error) => {
                throw new Error(error);
              });

              response.writeHead(302, { Location: "/account" });

              response.end();
            },
          );
        } else {
          throw new Error("Missing client_secret");
        }
      })
      .catch((error) => console.log(error));
  } else {
    response.statusCode = 405;

    return response.end();
  }
};

export default withSession(handler);
