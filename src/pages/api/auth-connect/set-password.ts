import { HttpStatus } from "@fwl/web";
import { GraphQLError } from "graphql";
import type { NextApiResponse } from "next";
import type { Handler } from "next-iron-session";

import { createOrUpdatePassword } from "@lib/commands/createOrUpdatePassword";
import type { ExtendedRequest } from "@src/@types/ExtendedRequest";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withMongoDB } from "@src/middlewares/withMongoDB";
import { withSentry } from "@src/middlewares/withSentry";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewares } from "@src/middlewares/wrapper";
import { getUser } from "@src/utils/getUser";

const handler: Handler = async (
  request: ExtendedRequest,
  response: NextApiResponse,
) => {
  if (request.method === "POST") {
    const { passwordInput } = request.body;

    const user = await getUser(request.headers["cookie"] as string);

    if (user) {
      return createOrUpdatePassword({
        cleartextPassword: passwordInput,
        userId: user.sub,
      }).then(({ data, errors }) => {
        if (errors) {
          response.setHeader("Content-Type", "application/json");

          const restrictionRulesError = ((errors as unknown) as GraphQLError &
            { code?: string }[]).find(
            (error) => error.code === "password_does_not_meet_requirements",
          );

          if (restrictionRulesError) {
            response.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
            response.json({ restrictionRulesError });
          } else {
            response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            response.end();
          }
        } else {
          response.statusCode = HttpStatus.OK;
          response.setHeader("Content-Type", "application/json");
          response.json({ data });
        }
      });
    } else {
      response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      response.setHeader("location", request.headers.referer || "/");
      response.end();
    }
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

  return Promise.reject();
};

export default wrapMiddlewares(
  [withLogger, withSentry, withMongoDB, withSession, withAuth],
  handler,
);
