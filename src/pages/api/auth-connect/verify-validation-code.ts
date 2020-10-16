import { HttpStatus } from "@fwl/web";
import { Handler } from "next-iron-session";

import { checkVerificationCode } from "@lib/queries/checkVerificationCode";
import { getTemporaryIdentities } from "@lib/queries/getTemporaryIdentities";
import type { ExtendedRequest } from "@src/@types/ExtendedRequest";
import { HttpVerbs } from "@src/@types/HttpVerbs";
import { config } from "@src/config";
import { MongoNoDataReturned, TemporaryIdentityExpired } from "@src/errors";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withMongoDB } from "@src/middlewares/withMongoDB";
import { withSentry } from "@src/middlewares/withSentry";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewares } from "@src/middlewares/wrapper";
import { fetchJson } from "@src/utils/fetchJson";

const handler: Handler = async (request: ExtendedRequest, response) => {
  if (request.method === "POST") {
    const { validationCode, eventId } = request.body;

    const user = await getTemporaryIdentities(eventId, request.mongoDb);

    if (user.length === 1 && user[0].temporaryIdentities) {
      const temporaryIdentity = user[0].temporaryIdentities.find(
        (temporaryIdentity) => temporaryIdentity.eventId === eventId,
      );

      if (temporaryIdentity && temporaryIdentity.expiresAt < Date.now()) {
        const { data } = await checkVerificationCode(validationCode, eventId);

        const { value, type } = temporaryIdentity;

        if (data && data.checkVerificationCode.status === "VALID") {
          const body = {
            userId: user[0].sub,
            type: type.toUpperCase(),
            value,
          };

          const route = "/api/identities";
          const absoluteURL = new URL(route, config.connectDomain).toString();

          await fetchJson(absoluteURL, HttpVerbs.POST, body);

          response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
            Location: "/account/logins",
          });

          return response.end();
        } else {
          response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
            Location: `/account/logins/${type}/validation/${eventId}`,
          });
        }
      } else {
        throw new TemporaryIdentityExpired();
      }
    } else {
      throw new MongoNoDataReturned();
    }
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

  return Promise.reject();
};

export default wrapMiddlewares(
  [withLogger, withSentry, withMongoDB, withSession, withAuth],
  handler,
);
