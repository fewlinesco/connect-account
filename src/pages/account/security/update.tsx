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
import useSWR from "swr";

import { Container } from "@src/components/containers/container";
import { SetPasswordForm } from "@src/components/forms/set-password-form";
import { Layout } from "@src/components/page-layout";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";

const SecurityUpdatePage: React.FC = () => {
  const { data, error } = useSWR<{ isPasswordSet: boolean }, Error>(
    "/api/auth-connect/is-password-set",
  );

  if (error) {
    throw error;
  }

  let conditionalBreadcrumb;

  if (!data) {
    conditionalBreadcrumb = "";
  } else {
    conditionalBreadcrumb = `Password | ${
      data.isPasswordSet ? "update" : "set"
    }`;
  }

  return (
    <Layout title="Security" breadcrumbs={conditionalBreadcrumb}>
      <Container>
        <SetPasswordForm
          conditionalBreadcrumbItem={
            !data ? "" : data.isPasswordSet ? "update" : "set"
          }
        />
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
    "/account/security/update",
    // async (request) => {
    //   const webErrors = {
    //     identityNotFound: ERRORS_DATA.IDENTITY_NOT_FOUND,
    //     connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
    //   };

    //   const userCookie = await getServerSideCookies<UserCookie>(request, {
    //     cookieName: "user-cookie",
    //     isCookieSealed: true,
    //     cookieSalt: configVariables.cookieSalt,
    //   });

    //   if (userCookie) {
    //     const isPasswordSet = await isUserPasswordSet(
    //       configVariables.managementCredentials,
    //       userCookie.sub,
    //     ).catch((error) => {
    //       if (error instanceof GraphqlErrors) {
    //         throw webErrorFactory({
    //           ...webErrors.identityNotFound,
    //           parentError: error,
    //         });
    //       }

    //       if (error instanceof ConnectUnreachableError) {
    //         throw webErrorFactory({
    //           ...webErrors.connectUnreachable,
    //           parentError: error,
    //         });
    //       }

    //       throw error;
    //     });

    //     return {
    //       props: {
    //         isPasswordSet,
    //       },
    //     };
    //   }

    //   return { props: {} };
    // },
  );
};

export { getServerSideProps };
export default SecurityUpdatePage;
