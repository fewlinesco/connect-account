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
import { Container } from "@src/components/containers/container";
import { Layout } from "@src/components/page-layout";
import { LoginsOverviewTest } from "@src/components/pages/logins-overview/logins-overview-test";
import { logger } from "@src/logger";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import getTracer from "@src/tracer";

const TestPage: React.FC<{
  alertMessages: string[] | null;
}> = ({ alertMessages }) => {
  return (
    <Layout
      alertMessages={alertMessages}
      title="Logins"
      breadcrumbs={["Your emails, phones and social logins"]}
    >
      <Container>
        <LoginsOverviewTest />
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
      const alertMessages = await getServerSideCookies(request, {
        cookieName: "alert-messages",
        isCookieSealed: false,
      });

      return {
        props: {
          alertMessages: alertMessages ? alertMessages : null,
        },
      };
    },
  );
};

export { getServerSideProps };
export default TestPage;
