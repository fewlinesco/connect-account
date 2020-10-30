import { HttpStatus } from "@fwl/web";
import { ObjectId } from "mongodb";

import type { MongoUser } from "@lib/@types/mongo/User";
import type { Handler } from "@src/@types/ApiPageHandler";
import { withAPIPageLogger } from "@src/middlewares/withAPIPageLogger";
import { withMongoDB } from "@src/middlewares/withMongoDB";
import withSession from "@src/middlewares/withSession";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";

const handler: Handler = async (request, response) => {
  addRequestScopeToSentry(request);

  try {
    if (request.method === "GET") {
      const userDocumentId = request.session.get("user-session-id");

      return request.mongoDb
        .collection("users")
        .findOne<MongoUser>({
          _id: new ObjectId(userDocumentId),
        })
        .then((user) => {
          response.statusCode = HttpStatus.OK;
          response.setHeader("Content-Type", "application/json");
          response.json({ user });
        });
    }

    response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

    return response.end();
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setTag("api/auth-connect/get-user", "api/auth-connect/get-user");
      Sentry.captureException(error);
    });
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

  return Promise.reject();
};

export default withAPIPageLogger(withSession(withMongoDB(handler)));
