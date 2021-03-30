import {
  ConnectUnreachableError,
  getIdentity,
  GraphqlErrors,
  Identity,
  IdentityTypes,
} from "@fewlines/connect-management";
import { getServerSideCookies, HttpStatus } from "@fwl/web";
import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
  rateLimitingMiddleware,
} from "@fwl/web/dist/middlewares";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";

import { UserCookie } from "@src/@types/user-cookie";
import { Container } from "@src/components/containers/container";
import { Layout } from "@src/components/page-layout";
import { IdentityOverview } from "@src/components/pages/identity-overview/identity-overview";
import { config } from "@src/config";
import { logger } from "@src/config/logger";
import getTracer from "@src/config/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";

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
    "/account/logins/[type]/[id]",
    async (request, response) => {
      if (!context?.params?.id) {
        response.statusCode = HttpStatus.NOT_FOUND;
        response.end();
        return;
      }

      const webErrors = {
        identityNotFound: ERRORS_DATA.IDENTITY_NOT_FOUND,
        connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
      };

      const userCookie = await getServerSideCookies<UserCookie>(request, {
        cookieName: "user-cookie",
        isCookieSealed: true,
        cookieSalt: config.cookieSalt,
      });

      if (userCookie) {
        const identity = await getIdentity(config.managementCredentials, {
          userId: userCookie.sub,
          identityId: context.params.id.toString(),
        }).catch((error) => {
          if (error instanceof GraphqlErrors) {
            throw webErrorFactory({
              ...webErrors.identityNotFound,
              parentError: error,
            });
          }

          if (error instanceof ConnectUnreachableError) {
            throw webErrorFactory({
              ...webErrors.connectUnreachable,
              parentError: error,
            });
          }

          throw error;
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
