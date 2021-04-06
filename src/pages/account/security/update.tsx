import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
  rateLimitingMiddleware,
} from "@fwl/web/dist/middlewares";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
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
  const router = useRouter();

  const { data: isPasswordSet, error: isPasswordSetError } = useSWR<
    { isPasswordSet: boolean },
    Error
  >("/api/auth-connect/is-password-set");

  const {
    data: isSudoModeAuthorized,
    error: isSudoModeAuthorizedError,
  } = useSWR<{ isSudoModeAuthorized: boolean }, Error>(
    "/api/auth-connect/is-sudo-mode-authorized",
  );

  if (isPasswordSetError || isSudoModeAuthorizedError) {
    throw isPasswordSetError || isSudoModeAuthorizedError;
  }

  if (!isSudoModeAuthorized) {
    console.log("unauthorized");
    router && router.push("/account/security/sudo");
  }

  console.log("authorized");

  let conditionalBreadcrumb;

  if (!isPasswordSet) {
    conditionalBreadcrumb = "";
  } else {
    conditionalBreadcrumb = `Password | ${isPasswordSet ? "update" : "set"}`;
  }

  return (
    <Layout title="Security" breadcrumbs={conditionalBreadcrumb}>
      <Container>
        <SetPasswordForm
          conditionalBreadcrumbItem={
            !isPasswordSet ? "" : isPasswordSet ? "update" : "set"
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
  );
};

export { getServerSideProps };
export default SecurityUpdatePage;
