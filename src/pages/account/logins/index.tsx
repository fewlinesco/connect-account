import { getIdentities } from "@fewlines/connect-management";
import { getServerSideCookies } from "@fwl/web";
import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
} from "@fwl/web/dist/middlewares";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import { GetServerSideProps } from "next";
import React from "react";

import type { SortedIdentities } from "@src/@types/sorted-identities";
import { UserCookie } from "@src/@types/user-cookie";
import { Container } from "@src/components/containers/container";
import { Layout } from "@src/components/page-layout";
import { LoginsOverview } from "@src/components/pages/logins-overview/logins-overview";
import { config } from "@src/config";
import { logger } from "@src/logger";
import { withAuth } from "@src/middlewares/with-auth";
import { withSentry } from "@src/middlewares/with-sentry";
import getTracer from "@src/tracer";
import { sortIdentities } from "@src/utils/sort-identities";

const LoginsOverviewPage: React.FC<{
  sortedIdentities: SortedIdentities;
  alertMessages?: string[];
}> = ({ sortedIdentities, alertMessages }) => {
  return (
    <Layout alertMessages={alertMessages}>
      <Container>
        <h1>Logins</h1>
        <h3>Your emails, phones and social logins</h3>
        <LoginsOverview sortedIdentities={sortedIdentities} />
      </Container>
    </Layout>
  );
};

export default LoginsOverviewPage;

const tracer = getTracer();

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares<{
    sortedIdentities: SortedIdentities;
  }>(
    context,
    [
      tracingMiddleware(tracer),
      recoveryMiddleware(tracer),
      errorMiddleware(tracer),
      loggingMiddleware(tracer, logger),
      withSentry,
      withAuth,
    ],
    async (request) => {
      const userCookie = await getServerSideCookies<UserCookie>(request, {
        cookieName: "user-cookie",
        isCookieSealed: true,
        cookieSalt: config.cookieSalt,
      });

      if (userCookie) {
        const sortedIdentities = await getIdentities(
          config.managementCredentials,
          userCookie.sub,
        ).then((identities) => {
          return sortIdentities(identities);
        });

        const alertMessages = await getServerSideCookies(request, {
          cookieName: "alert-messages",
          isCookieSealed: false,
        });

        console.log(alertMessages);

        return {
          props: {
            sortedIdentities,
            alertMessages: alertMessages ? alertMessages : null,
          },
        };
      }

      return { props: {} };
    },
  );
};
