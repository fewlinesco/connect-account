import { HttpStatus } from "@fwl/web";
import { GraphQLError } from "graphql";
import type { NextApiResponse } from "next";
import type { Handler } from "next-iron-session";

import { createOrUpdatePassword } from "@lib/commands/createOrUpdatePassword";
import { UserCookie } from "@src/@types/UserCookie";
import type { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewares } from "@src/middlewares/wrapper";

const handler: Handler = async (
  request: ExtendedRequest,
  response: NextApiResponse,
) => {
  if (request.method === "POST") {
    const { passwordInput } = request.body;

    const userSession = request.session.get<UserCookie>("user-cookie");

    if (userSession) {
      return createOrUpdatePassword({
        cleartextPassword: passwordInput,
        userId: userSession.sub,
      }).then(({ data, errors }) => {
        if (errors) {
          const restrictionRulesError = ((errors as unknown) as GraphQLError &
            { code?: string }[]).find(
            (error) => error.code === "password_does_not_meet_requirements",
          );

          if (restrictionRulesError) {
            response.setHeader("Content-Type", "application/json");
            response.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
            response.json({ restrictionRulesError });
          } else {
            response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            response.end();
          }
        } else if (!data) {
          response.statusCode = HttpStatus.NOT_FOUND;
          response.end();
        } else {
          response.setHeader("Content-Type", "application/json");
          response.statusCode = HttpStatus.OK;
          response.json({ data });
        }
      });
    }
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

  return Promise.reject();
};

export default wrapMiddlewares(
  [withLogger, withSentry, withSession, withAuth],
  handler,
);
