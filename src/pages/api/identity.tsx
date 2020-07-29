import { NextApiRequest, NextApiResponse } from "next";
import { withAPIPageLogger } from "src/middleware/withAPIPageLogger";

import { addIdentityToUser } from "../../command/addIdentityToUser";
import { removeIdentityFromUser } from "../../command/removeIdentityFromUser";

async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<JSON | void> {
  const { userId, type, value } = request.body;

  console.log(userId, type, value);

  if (request.method === "POST") {
    return await addIdentityToUser({ userId, type, value })
      .then((data) => {
        response.statusCode = 200;

        return response.json({ data });
      })
      .catch((error) => {
        console.log(error);

        response.statusCode = 400;

        return response.json({ error: "Could not add identity" });
      });
  } else if (request.method === "DELETE") {
    return await removeIdentityFromUser({ userId, type, value })
      .then((data) => {
        response.statusCode = 200;

        return response.json({ data });
      })
      .catch((error) => {
        console.log(error);

        response.statusCode = 400;

        return response.json({ error: "Could not remove identity" });
      });
  }
  response.statusCode = 405;

  return response.end();
}

export default withAPIPageLogger(handler);

// const loggedAPIPage = withAPIPageLogger(
//   async (
//     request: NextApiRequest,
//     response: NextApiResponse,
//   ): Promise<JSON | void> => {
//     const { userId, type, value } = request.body;

//     if (request.method === "POST") {
//       return await addIdentityToUser({ userId, type, value })
//         .then((data) => {
//           response.statusCode = 200;

//           return response.json({ data });
//         })
//         .catch((error) => {
//           console.log(error);

//           response.statusCode = 400;

//           return response.json({ error: "Could not add identity" });
//         });
//     } else if (request.method === "DELETE") {
//       return await removeIdentityFromUser({ userId, type, value })
//         .then((data) => {
//           response.statusCode = 200;

//           return response.json({ data });
//         })
//         .catch((error) => {
//           console.log(error);

//           response.statusCode = 400;

//           return response.json({ error: "Could not remove identity" });
//         });
//     }
//     response.statusCode = 405;

//     return response.end();
//   },
// );

// export default loggedAPIPage;
