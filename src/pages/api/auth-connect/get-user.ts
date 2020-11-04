import { HttpStatus } from "@fwl/web";
import { ObjectId } from "mongodb";

import type { MongoUser } from "@lib/@types/mongo/User";
import type { Handler } from "@src/@types/Handler";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withMongoDB } from "@src/middlewares/withMongoDB";
import { withSentry } from "@src/middlewares/withSentry";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewares } from "@src/middlewares/wrapper";

const handler: Handler = async (request, response) => {
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
        response.end(JSON.stringify({ user }));
      });
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

  return Promise.reject();
};

export default wrapMiddlewares(
  [withLogger, withSentry, withMongoDB, withSession, withAuth],
  handler,
);
