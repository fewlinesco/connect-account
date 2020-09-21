import { HttpStatus } from "@fwl/web";
import { Handler } from "next-iron-session";

import { ExtendedRequest } from "@src/@types/ExtendedRequest";
import { insertTemporaryIdentity } from "@src/command/insertTemporaryIdentity";
import { config, oauth2Client } from "@src/config";
import { MongoUpdateError } from "@src/errors";
import { withAPIPageLogger } from "@src/middleware/withAPIPageLogger";
import { withMongoDB } from "@src/middleware/withMongoDB";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";

const handler: Handler = async (request: ExtendedRequest, response) => {
  addRequestScopeToSentry(request);

  try {
    if (request.method === "POST") {
      const { type, value, ttl } = request.body;

      const accessToken = request.session.get("user-jwt");

      const decoded = await oauth2Client.verifyJWT<{ sub: string }>(
        accessToken,
        config.connectJwtAlgorithm,
      );

      request.mongoDb.collection("users").createIndex({ sub: 1 });

      const temporaryIdentity = {
        eventId: "",
        value,
        type: type.toUpperCase(),
        ttl,
      };

      const result = await insertTemporaryIdentity(
        decoded.sub,
        temporaryIdentity,
        request.mongoDb,
      );

      if (result.n === 0) {
        throw new MongoUpdateError("Mongo update failed");
      }

      response.statusCode = HttpStatus.OK;

      response.setHeader("Content-Type", "application/json");

      response.end();
    }
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setTag("insert-temporary-identity", "insert-temporary-identity");
      Sentry.captureException(error);
    });
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

  return Promise.reject();
};

export default withAPIPageLogger(withMongoDB(handler));
