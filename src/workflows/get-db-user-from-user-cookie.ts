import { Tracer } from "@fwl/tracing";
import { getServerSideCookies } from "@fwl/web";
import { NextApiRequest } from "next";

import { DynamoUser } from "@src/@types/dynamo-user";
import { UserCookie } from "@src/@types/user-cookie";
import { CONFIG_VARIABLES } from "@src/configs/config-variables";
import { NoUserCookieFoundError } from "@src/errors/errors";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";

const getUserFromCookie = async (
  tracer: Tracer,
  request: NextApiRequest,
): Promise<DynamoUser> => {
  return tracer.span("get-user-from-cookie", async (span) => {
    const webErrors = {
      databaseUnreachable: ERRORS_DATA.DATABASE_UNREACHABLE,
      noUserFound: ERRORS_DATA.NO_USER_FOUND,
      sudoModeTTLNotFound: ERRORS_DATA.SUDO_MODE_TTL_NOT_FOUND,
    };

    const userCookie = await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
      cookieSalt: CONFIG_VARIABLES.cookieSalt,
    });

    if (!userCookie) {
      span.setDisclosedAttribute("cookie found", false);
      throw new NoUserCookieFoundError();
    }
    span.setDisclosedAttribute("cookie found", true);

    const user = await getDBUserFromSub(userCookie.sub).catch((error) => {
      throw webErrorFactory({
        ...webErrors.databaseUnreachable,
        parentError: error,
      });
    });

    if (!user) {
      span.setDisclosedAttribute("user found in database", false);
      throw webErrorFactory(webErrors.noUserFound);
    }
    span.setDisclosedAttribute("user found in database", user.sub);
    return user;
  });
};

export { getUserFromCookie };
