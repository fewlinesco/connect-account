import {
  getIdentity,
  Identity,
  IdentityTypes,
} from "@fewlines/connect-management";
import { getServerSideCookies } from "@fwl/web";
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
import { Layout } from "@src/components/page-layout";
import { IdentityOverview } from "@src/components/pages/identity-overview/identity-overview";
import { config } from "@src/config";
import { logger } from "@src/logger";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { withSentry } from "@src/middlewares/with-sentry";
import getTracer from "@src/tracer";

const IdentityOverviewPage: React.FC<{
  identity: Identity;
  userId: string;
}> = ({ identity, userId }) => {
  const { type } = identity;

  return (
    <Layout
      title="Logins"
      breadcrumbs={[
        type.toUpperCase() === IdentityTypes.EMAIL
          ? "Email address"
          : "Phone number",
      ]}
    >
      <Container>
        <IdentityOverview identity={identity} userId={userId} />
      </Container>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares<{ type: string }>(
    context,
    [
      tracingMiddleware(getTracer()),
      recoveryMiddleware(getTracer()),
      withSentry,
      errorMiddleware(getTracer()),
      loggingMiddleware(getTracer(), logger),
      authMiddleware(getTracer()),
    ],
    "/account/logins/[type]/[id]",
    async (request, response) => {
      if (!context?.params?.id) {
        response.statusCode = 400;
        response.end();
        return;
      }

      const userCookie = await getServerSideCookies<UserCookie>(request, {
        cookieName: "user-cookie",
        isCookieSealed: true,
        cookieSalt: config.cookieSalt,
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

export { getServerSideProps };
export default IdentityOverviewPage;
