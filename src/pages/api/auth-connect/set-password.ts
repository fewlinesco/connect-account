import { HttpStatus } from "@fwl/web";
import { GraphQLError } from "graphql";

import { createOrUpdatePassword } from "@lib/commands/createOrUpdatePassword";
import { UserCookie } from "@src/@types/UserCookie";
import { Handler } from "@src/@types/core/Handler";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { wrapMiddlewares } from "@src/middlewares/wrapper";
import { getServerSideCookies } from "@src/utils/serverSideCookies";

const handler: Handler = async (request, response) => {
  if (request.method === "POST") {
    const { passwordInput } = request.body;

    const userCookie = await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
    });

    if (userCookie) {
      return createOrUpdatePassword({
        cleartextPassword: passwordInput,
        userId: userCookie.sub,
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

export default wrapMiddlewares([withLogger, withSentry, withAuth], handler);
