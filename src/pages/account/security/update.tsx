import { isUserPasswordSet } from "@fewlines/connect-management";
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
import { SetPasswordForm } from "@src/components/forms/set-password-form";
import { NavigationBreadcrumbs } from "@src/components/navigation-breadcrumbs/navigation-breadcrumbs";
import { Layout } from "@src/components/page-layout";
import { config } from "@src/config";
import { logger } from "@src/logger";
import { withAuth } from "@src/middlewares/with-auth";
import { withSentry } from "@src/middlewares/with-sentry";
import getTracer from "@src/tracer";
import { getServerSideCookies } from "@src/utils/server-side-cookies";

type SecurityPageProps = {
  isPasswordSet: boolean;
};

const SecurityUpdatePage: React.FC<SecurityPageProps> = ({ isPasswordSet }) => {
  const conditionalBreadcrumbItem = isPasswordSet ? "update" : "set";

  return (
    <Layout>
      <Container>
        <h1>Security</h1>
        <NavigationBreadcrumbs
          breadcrumbs={["Password", conditionalBreadcrumbItem]}
        />
        <SetPasswordForm
          conditionalBreadcrumbItem={conditionalBreadcrumbItem}
        />
      </Container>
    </Layout>
  );
};

export default SecurityUpdatePage;

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
      withAuth,
    ],
    async (request) => {
      const userCookie = await getServerSideCookies<UserCookie>(request, {
        cookieName: "user-cookie",
        isCookieSealed: true,
      });

      if (userCookie) {
        const isPasswordSet = await isUserPasswordSet(
          config.managementCredentials,
          userCookie.sub,
        );

        return {
          props: {
            isPasswordSet,
          },
        };
      }

      return { props: {} };
    },
  );
};
