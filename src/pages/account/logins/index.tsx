import { getIdentities } from "@fewlines/connect-management";
import { getServerSideCookies } from "@fwl/web";
import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
  rateLimitingMiddleware,
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
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import getTracer from "@src/tracer";
import { sortIdentities } from "@src/utils/sort-identities";

const LoginsOverviewPage: React.FC<{
  sortedIdentities: SortedIdentities;
  alertMessages?: string[];
}> = ({ sortedIdentities, alertMessages }) => {
  return (
    <Layout
      alertMessages={alertMessages}
      title="Logins"
      breadcrumbs={["Your emails, phones and social logins"]}
    >
      <Container>
        <LoginsOverview sortedIdentities={sortedIdentities} />
      </Container>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares<{
    sortedIdentities: SortedIdentities;
  }>(
    context,
    [
      tracingMiddleware(getTracer()),
      rateLimitingMiddleware(getTracer(), logger, {
        windowMs: 300000,
        requestsUntilBlock: 200,
      }),
      recoveryMiddleware(getTracer()),
      sentryMiddleware(getTracer()),
      errorMiddleware(getTracer()),
      loggingMiddleware(getTracer(), logger),
      authMiddleware(getTracer()),
    ],
    "/account/logins",
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

export { getServerSideProps };
export default LoginsOverviewPage;
