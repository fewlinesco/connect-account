import { HttpStatus } from "@fwl/web";
import type { GetServerSideProps } from "next";
import React from "react";

import { isUserPasswordSet } from "@lib/queries/isUserPasswordSet";
import type { AccessToken } from "@src/@types/oauth2/OAuth2Tokens";
import { Security } from "@src/components/display/fewlines/Security/Security";
import { config, oauth2Client } from "@src/config";
import { GraphqlErrors, OAuth2Error } from "@src/errors";
import { withSSRLogger } from "@src/middleware/withSSRLogger";
import withSession from "@src/middleware/withSession";
import { getUser } from "@src/utils/getUser";
import { refreshTokens } from "@src/utils/refreshTokens";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";

type SecurityPageProps = {
  isPasswordSet: boolean;
};

const SecurityPage: React.FC<SecurityPageProps> = ({ isPasswordSet }) => {
  return <Security isPasswordSet={isPasswordSet} />;
};

export default SecurityPage;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  withSession(async (context) => {
    addRequestScopeToSentry(context.req);

    try {
      const userDocumentId = context.req.session.get("user-session-id");

      const user = await getUser(context.req.headers["cookie"]);

      if (user) {
        const decodedJWT = await oauth2Client
          .verifyJWT<AccessToken>(user.accessToken, config.connectJwtAlgorithm)
          .catch(async (error) => {
            if (error.name === "TokenExpiredError") {
              const body = {
                userDocumentId,
                refreshToken: user.refreshToken,
              };

              const { access_token } = await refreshTokens(body);

              return access_token;
            } else {
              throw error;
            }
          });
        // too many redirects
        const isPasswordSet = await isUserPasswordSet(
          (decodedJWT as AccessToken).sub,
        ).then((result) => {
          if (result.errors) {
            throw new GraphqlErrors(result.errors);
          }

          return result;
        });

        return {
          props: {
            isPasswordSet,
          },
        };
      } else {
        context.res.statusCode = HttpStatus.TEMPORARY_REDIRECT;
        context.res.setHeader("location", context.req.headers.referer || "/");
        context.res.end();

        return { props: {} };
      }
    } catch (error) {
      if (error instanceof OAuth2Error) {
        Sentry.withScope((scope) => {
          scope.setTag(
            "/pages/account/security SSR",
            "/pages/account/security SSR",
          );
          Sentry.captureException(error);
        });

        context.res.statusCode = HttpStatus.TEMPORARY_REDIRECT;
        context.res.setHeader("location", context.req.headers.referer || "/");
        context.res.end();

        return { props: {} };
      }

      throw error;
    }
  }),
);
