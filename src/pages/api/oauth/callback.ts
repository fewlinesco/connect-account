import jwt from "jsonwebtoken";
import { NextApiResponse } from "next";
import { Handler } from "next-iron-session";
import { ExtendedRequest } from "src/@types/ExtendedRequest";
import { withAPIPageLogger } from "src/middleware/withAPIPageLogger";
import withSession from "src/middleware/withSession";

function promisifiedJWTVerify(oauthData: {
  clientSecret?: string;
  accessToken: string;
}): Promise<{
  error: jwt.VerifyErrors | null;
  decoded: Record<string, unknown>;
}> {
  const { clientSecret, accessToken } = oauthData;

  return new Promise((resolve, reject) => {
    console.log(accessToken);
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

      const decodedJWT = await promisifiedJWTVerify({
        clientSecret: callback.client_secret,
        accessToken: parsedResponse.access_token,
      });

      console.log(decodedJWT);

      if (decodedJWT.error !== null) {
        throw new Error(decodedJWT.error.message);
      }

      request.session.set("user-id", decodedJWT.decoded.sub);
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
