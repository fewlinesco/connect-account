import jwt from "jsonwebtoken";
import { NextApiResponse } from "next";
import { Handler } from "next-iron-session";
import { ExtendedRequest } from "src/@types/ExtendedRequest";
import withSession from "src/middleware/withSession";

function promisifiedJWTVerify(
  oauthData: { clientSecret?: string; accessToken: string },
  request: ExtendedRequest,
  response: NextApiResponse,
): Promise<any> {
  const { clientSecret, accessToken } = oauthData;

  return new Promise((resolve, reject) => {
    if (clientSecret) {
      jwt.verify(
        accessToken,
        clientSecret,
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

          resolve();
        },
      );
    } else {
      reject("Missing client_secret");
    }
  });
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

    try {
      const fetchedResponse = await fetch(
        `${process.env.PROVIDER_URL}/oauth/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(callback),
        },
      );

      const parsedResponse = await fetchedResponse.json();

      await promisifiedJWTVerify(
        {
          clientSecret: callback.client_secret,
          accessToken: parsedResponse.access_token,
        },
        request,
        response,
      );
    } catch (error) {
      throw new Error(error);
    }
  } else {
    response.statusCode = 405;

    return response.end();
  }
};

export default withSession(handler);
