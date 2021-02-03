import { getIdentities } from "@fewlines/connect-management";
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
import { withSentry } from "@src/middlewares/with-sentry";
import getTracer from "@src/tracer";
import { displayAlertBar } from "@src/utils/display-alert-bar";
import { getFlashMessage } from "@src/utils/get-flash-message";
import { getServerSideCookies } from "@src/utils/server-side-cookies";
import { sortIdentities } from "@src/utils/sort-identities";

type LoginsOverviewPageProps = {
  sortedIdentities: SortedIdentities;
};

const LoginsOverviewPage: React.FC<LoginsOverviewPageProps> = ({
  sortedIdentities,
}) => {
  const alert = getFlashMessage();

  return (
    <Layout>
      <Container>
        {alert && displayAlertBar(alert)}
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
    ],
    async (request) => {
      const userCookie = await getServerSideCookies<UserCookie>(request, {
        cookieName: "user-cookie",
        isCookieSealed: true,
      });

      if (userCookie) {
        const sortedIdentities = await getIdentities(
          config.managementCredentials,
          userCookie.sub,
        ).then((identities) => {
          return sortIdentities(identities);
        });

        return {
          props: {
            sortedIdentities,
          },
        };
      }

      return { props: {} };
    },
  );
};
