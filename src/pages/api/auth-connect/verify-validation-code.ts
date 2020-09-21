import { HttpStatus } from "@fwl/web";
import { Handler } from "next-iron-session";

import { checkVerificationCode } from "@lib/checkVerificationCode";
import { ExtendedRequest } from "@src/@types/ExtendedRequest";
import { HttpVerbs } from "@src/@types/HttpVerbs";
import { config } from "@src/config";
import { MongoNoDataReturned, TemporaryIdentityExpired } from "@src/errors";
import { withAPIPageLogger } from "@src/middleware/withAPIPageLogger";
import { withMongoDB } from "@src/middleware/withMongoDB";
import withSession from "@src/middleware/withSession";
import { getTemporaryIdentities } from "@src/queries/getTemporaryIdentities";
import { fetchJson } from "@src/utils/fetchJson";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";

const handler: Handler = async (request: ExtendedRequest, response) => {
  addRequestScopeToSentry(request);

  try {
    if (request.method === "POST") {
      const { validationCode, eventId } = request.body;

      const user = await getTemporaryIdentities(eventId, request.mongoDb);

      if (user.length === 1 && user[0].temporaryIdentities) {
        const temporaryIdentity = user[0].temporaryIdentities.find(
          (temporaryIdentity) => temporaryIdentity.eventId === eventId,
        );

        if (temporaryIdentity && temporaryIdentity.ttl < Date.now()) {
          const { data } = await checkVerificationCode(validationCode, eventId);

          if (data && data.checkVerificationCode.status === "VALID") {
            const { value, type } = temporaryIdentity;

            const body = {
              userId: user[0].sub,
              type: type.toUpperCase(),
              value,
            };

            const route = "/api/identities";
            const absoluteURL = new URL(route, config.connectDomain).toString();

            await fetchJson(absoluteURL, HttpVerbs.POST, body);

            // Do not work.
            response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
              Location: "/account/logins",
            });
            return response.end();
          }
        } else {
          throw new TemporaryIdentityExpired();
        }
      } else {
        throw new MongoNoDataReturned();
      }
    }
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setTag(
        "send-identity-validation-code",
        "send-identity-validation-code",
      );
      Sentry.captureException(error);
    });
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

  return Promise.reject();
};

export default withAPIPageLogger(withSession(withMongoDB(handler)));
