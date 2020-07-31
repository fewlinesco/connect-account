import { NextApiRequest, NextApiResponse } from "next";

export default async (
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> => {
  // console.log(request);

  // console.log(request);
  // console.log(
  //   "================================================================================",
  // );
  // console.log(response);

  if (request.method === "GET") {
    const callback = {
      client_id: process.env.API_CLIENT_ID,
      client_secret: process.env.API_CLIENT_SECRET,
      code: request.query.code,
      grant_type: "authorization_code",
      redirect_uri: process.env.API_REDIRECT_URI,
    };

    console.log(callback);

    fetch(`${process.env.PROVIDER_URL}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(callback),
    }).then((response) => response.json());
  }

  response.statusCode = 405;

  return response.end();
};
