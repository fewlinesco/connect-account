import { HttpStatus } from "@fwl/web";
import type { GetServerSideProps } from "next";
import React from "react";

import { Identity } from "@lib/@types";
import { getIdentity } from "@lib/queries/getIdentity";
import type { AccessToken } from "@src/@types/oauth2/OAuth2Tokens";
import { NoIdentityFound } from "@src/clientErrors";
import { ShowIdentity } from "@src/components/display/fewlines/ShowIdentity/ShowIdentity";
import { config, oauth2Client } from "@src/config";
import { GraphqlErrors, OAuth2Error } from "@src/errors";
import { withSSRLogger } from "@src/middleware/withSSRLogger";
import withSession from "@src/middleware/withSession";
import { getUser } from "@src/utils/getUser";
import { refreshTokens } from "@src/utils/refreshTokens";
import Sentry from "@src/utils/sentry";

const ShowIdentityPage: React.FC<{ identity: Identity }> = ({ identity }) => {
  return <ShowIdentity identity={identity} />;
};

export default ShowIdentityPage;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  withSession(async (context) => {
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

        const identity = await getIdentity(
          (decodedJWT as AccessToken).sub,
          context.params.id,
        ).then((result) => {
          if (result.errors) {
            throw new GraphqlErrors(result.errors);
          }

          if (result.data && !result.data.provider.user.identity) {
            throw new NoIdentityFound();
          }

          return result.data?.provider.user.identity;
        });

        return {
          props: {
            identity,
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
            "/pages/account/logins SSR",
            "/pages/account/logins SSR",
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
