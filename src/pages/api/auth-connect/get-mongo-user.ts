import { HttpStatus } from "@fwl/web";
import { ObjectId } from "mongodb";

import { Handler } from "../../../@types/ApiPageHandler";
import { MongoUser } from "../../../@types/mongo/User";
import { withAPIPageLogger } from "../../../middleware/withAPIPageLogger";
import { withMongoDB } from "../../../middleware/withMongoDB";
import Sentry, { addRequestScopeToSentry } from "../../../utils/sentry";

const handler: Handler = async (request, response) => {
  addRequestScopeToSentry(request);

  try {
    if (request.method === "POST") {
      const { userDocumentId } = request.body;

      return await request.mongoDb
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
      scope.setTag(
        "api/auth-connect/get-mongo-user",
        "api/auth-connect/get-mongo-user",
      );
      Sentry.captureException(error);
    });
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

  return Promise.reject();
};

export default withAPIPageLogger(withMongoDB(handler));
