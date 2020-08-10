import jwt from "jsonwebtoken";
import { NextApiResponse } from "next";
import { Handler } from "next-iron-session";

import { ExtendedRequest } from "../../../@types/ExtendedRequest";
import { withAPIPageLogger } from "../../../middleware/withAPIPageLogger";
import withSession from "../../../middleware/withSession";

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

      if (callback.client_secret) {
        jwt.verify(parsedResponse.access_token, callback.client_secret);
      } else {
        response.writeHead(302, { Location: "/account" });
        response.end();

        throw new Error("Missing client_secret");
      }

      request.session.set("user-jwt", parsedResponse.access_token);

      await request.session.save().catch((error) => {
        throw new Error(error);
      });

      response.writeHead(302, { Location: "/account" });
      response.end();
    } catch (error) {
      throw new Error(error);
    }
  } else {
    response.statusCode = 405;

    return response.end();
  }
};

export default withAPIPageLogger(withSession(handler));
