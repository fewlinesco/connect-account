import { HttpStatus } from "@fwl/web";
import { Handler } from "next-iron-session";

import { checkVerificationCode } from "@lib/checkVerificationCode";
import { ExtendedRequest } from "@src/@types/ExtendedRequest";
import { HttpVerbs } from "@src/@types/HttpVerbs";
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

      /**
       * Get temporary identities
       * Check if still valid
       * Check verif code
       * insert identity
       */

      const user = await getTemporaryIdentities(eventId, request.mongoDb);

      if (user.length === 1 && user[0].temporaryIdentities) {
        const temporaryIdentity = user[0].temporaryIdentities.find(
          (temporaryIdentity) => temporaryIdentity.eventId === eventId,
        );

        if (temporaryIdentity.ttl) {
          const x = checkVerificationCode(validationCode, eventId);

          const body = {
            validationCode,
          };
        } else {
          throw new TemporaryIdentityExpired();
        }
      } else {
        throw new MongoNoDataReturned();
      }

      // fetchJson("/api/identities", HttpVerbs.POST, body);

      // const user = await getUser(request.head ers["cookie"] as string);

      // if (user) {
      //   const decoded = await oauth2Client.verifyJWT<{ sub: string }>(
      //     user.accessToken,
      //     config.connectJwtAlgorithm,
      //   );

      //   const identity = {
      //     status: IdentityStatus.VALIDATED,
      //     type: identityInput.type.toUpperCase(),
      //     value: identityInput.value,
      //   };

      //   return sendIdentityValidationCode({
      //     callbackUrl,
      //     identity,
      //     localeCodeOverride: "en-EN",
      //     userId: decoded.sub,
      //   })
      //     .then(async ({ errors, data }) => {
      //       if (errors) {
      //         throw new GraphqlErrors(errors);
      //       }

      //       if (data) {
      //         const temporaryIdentity = {
      //           eventId: data.sendIdentityValidationCode.eventId,
      //           value: identityInput.value,
      //           type: identityInput.type,
      //         };

      //         await insertTemporaryIdentity(
      //           decoded.sub,
      //           temporaryIdentity,
      //           request.mongoDb,
      //         );

      //         return;
      //       } else {
      //         throw new MongoNoDataReturned();
      //       }
      //     })
      //     .then((data) => {
      //       response.statusCode = HttpStatus.OK;
      //       response.setHeader("Content-Type", "application/json");
      //       response.json({ data });
      //     });
      // } else {
      //   response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      //   response.setHeader("location", request.headers.referer || "/");
      //   response.end();
      // }
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

// locale
// temporaryIdentities: [
// eventId
// value
// type
// ]
