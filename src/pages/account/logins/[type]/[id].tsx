import {
  getIdentity,
  Identity,
  IdentityTypes,
} from "@fewlines/connect-management";
import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
} from "@fwl/web/dist/middlewares";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";

import { UserCookie } from "@src/@types/user-cookie";
import { Container } from "@src/components/containers/container";
import { NavigationBreadcrumbs } from "@src/components/navigation-breadcrumbs/navigation-breadcrumbs";
import { Layout } from "@src/components/page-layout";
import { IdentityOverview } from "@src/components/pages/identity-overview/identity-overview";
import { config } from "@src/config";
import { logger } from "@src/logger";
import { withSentry } from "@src/middlewares/with-sentry";
import getTracer from "@src/tracer";
import { getServerSideCookies } from "@src/utils/server-side-cookies";

const IdentityOverviewPage: React.FC<{
  identity: Identity;
  userId: string;
}> = ({ identity, userId }) => {
  const { type } = identity;

  return (
    <Layout>
      <Container>
        <h1>Logins</h1>
        <NavigationBreadcrumbs
          breadcrumbs={[
            type.toUpperCase() === IdentityTypes.EMAIL
              ? "Email address"
              : "Phone number",
          ]}
        />
        <IdentityOverview identity={identity} userId={userId} />
      </Container>
    </Layout>
  );
};

export default IdentityOverviewPage;

const tracer = getTracer();

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares<{ type: string }>(
    context,
    [
      tracingMiddleware(tracer),
      recoveryMiddleware(tracer),
      errorMiddleware(tracer),
      loggingMiddleware(tracer, logger),
      withSentry,
    ],
    async (request, response) => {
      if (!context?.params?.id) {
        response.statusCode = 400;
        response.end();
        return;
      }

      const userCookie = await getServerSideCookies<UserCookie>(request, {
        cookieName: "user-cookie",
        isCookieSealed: true,
      });

      if (userCookie) {
        const identity = await getIdentity(config.managementCredentials, {
          userId: userCookie.sub,
          identityId: context.params.id.toString(),
        });

        return {
          props: {
            identity,
            userId: userCookie.sub,
          },
        };
      }

      return { props: {} };
    },
  );
};
