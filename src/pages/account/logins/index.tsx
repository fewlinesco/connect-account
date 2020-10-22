import { HttpStatus } from "@fwl/web";
import type { GetServerSideProps } from "next";
import React from "react";

import { getIdentities } from "@lib/queries/getIdentities";
import type { SortedIdentities } from "@src/@types/SortedIdentities";
import type { AccessToken } from "@src/@types/oauth2/OAuth2Tokens";
import { Container } from "@src/components/display/fewlines/Container";
import { H1 } from "@src/components/display/fewlines/H1/H1";
import { H2 } from "@src/components/display/fewlines/H2/H2";
import LoginsOverview from "@src/components/display/fewlines/LoginsOverview/LoginsOverview";
import { config, oauth2Client } from "@src/config";
import { GraphqlErrors, OAuth2Error } from "@src/errors";
import { withSSRLogger } from "@src/middleware/withSSRLogger";
import withSession from "@src/middleware/withSession";
import { getUser } from "@src/utils/getUser";
import { refreshTokens } from "@src/utils/refreshTokens";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";
import { sortIdentities } from "@src/utils/sortIdentities";

type LoginsOverviewPageProps = {
  sortedIdentities: SortedIdentities;
};

const LoginsOverviewPage: React.FC<LoginsOverviewPageProps> = ({
  sortedIdentities,
}) => {
  return (
    <Container>
      <H1>Logins</H1>
      <H2>Your emails, phones and social logins</H2>
      <LoginsOverview sortedIdentities={sortedIdentities} />
    </Container>
  );
};

export default LoginsOverviewPage;

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

        const sortedIdentities = await getIdentities(
          (decodedJWT as AccessToken).sub,
        ).then((result) => {
          if (result.errors) {
            throw new GraphqlErrors(result.errors);
          }

          return sortIdentities(result);
        });

        return {
          props: {
            sortedIdentities,
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
