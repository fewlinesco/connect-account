import { HttpStatus } from "@fwl/web";
import { Handler } from "next-iron-session";

import {
  IdentityStatus,
  sendIdentityValidationCode,
} from "@lib/sendIdentityValidationCode";
import { ExtendedRequest } from "@src/@types/ExtendedRequest";
import { insertTemporaryIdentity } from "@src/command/insertTemporaryIdentity";
import { config, oauth2Client } from "@src/config";
import { withAPIPageLogger } from "@src/middleware/withAPIPageLogger";
import { withMongoDB } from "@src/middleware/withMongoDB";
import withSession from "@src/middleware/withSession";
import { getUser } from "@src/utils/getUser";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";

const handler: Handler = async (request: ExtendedRequest, response) => {
  addRequestScopeToSentry(request);

  try {
    if (request.method === "POST") {
      const { callbackUrl, identityInput } = request.body;

      const user = await getUser(request.headers["cookie"] as string);

      if (user) {
        const decoded = await oauth2Client.verifyJWT<{ sub: string }>(
          user.accessToken,
          config.connectJwtAlgorithm,
        );

        const identity = {
          status: IdentityStatus.VALIDATED,
          type: identityInput.type.toUpperCase(),
          value: identityInput.value,
        };

        const x = {
          callbackUrl,
          identity,
          localeCodeOverride: "en-EN",
          userId: decoded.sub,
        };

        return await sendIdentityValidationCode({
          callbackUrl,
          identity,
          localeCodeOverride: "en-EN",
          userId: decoded.sub,
        })
          .then(async (data) => {
            // { data: {
            //   sendIdentityValidationCode: {
            //     __typename: 'SendIdentityValidationCodeResult',
            //     callbackUrl: '/',
            //     eventId: '6ea48f7d-de56-4511-b230-709960912566',
            //     localeCode: 'en-EN',
            //     nonce: 'JrCAW1dhYMEn8tgjZa3htA=='
            //   }
            // }}

            console.log("hello");
            // @ts-ignore
            console.log(data.sendIdentityValidationCode.eventId);

            const temporaryIdentity = {
              eventId: "data.sendIdentityValidationCode.eventId",
              value: identityInput.value,
              type: identityInput.type,
            };

            await insertTemporaryIdentity(
              decoded.sub,
              temporaryIdentity,
              request.mongoDb,
            );

            return data;
          })
          .then((data) => {
            response.statusCode = HttpStatus.OK;
            response.setHeader("Content-Type", "application/json");
            response.json({ data });
          });
      } else {
        response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
        response.setHeader("location", request.headers.referer || "/");
        response.end();
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

// locale
// temporaryIdentities: [
// eventId
// value
// type
// ]
