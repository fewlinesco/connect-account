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
import { useIntl } from "react-intl";
import useSWR from "swr";

import { Container } from "@src/components/containers/container";
import { SetPasswordForm } from "@src/components/forms/set-password-form";
import { Layout } from "@src/components/page-layout";
import { logger } from "@src/configs/logger";
import rateLimitingConfig from "@src/configs/rate-limiting-config";
import getTracer from "@src/configs/tracer";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import { verifySudoModeMiddleware } from "@src/middlewares/verify-sudo-mode-middleware";

const SecurityUpdatePage: React.FC = () => {
  const { data: passwordSetData, error: passwordSetError } = useSWR<
    { isPasswordSet: boolean },
    Error
  >("/api/auth-connect/is-password-set");

  if (passwordSetError) {
    throw passwordSetError;
  }

  const { formatMessage } = useIntl();
  let conditionalBreadcrumb;

  if (!passwordSetData) {
    conditionalBreadcrumb = "";
  } else {
    conditionalBreadcrumb = passwordSetData.isPasswordSet
      ? formatMessage({ id: "updateBreadcrumb" })
      : formatMessage({ id: "setBreadcrumb" });
  }

  return (
    <Layout breadcrumbs={conditionalBreadcrumb} title="Security">
      <Container>
        <SetPasswordForm
          conditionalBreadcrumbItem={
            !passwordSetData
              ? ""
              : passwordSetData.isPasswordSet
              ? formatMessage({ id: "update" })
              : formatMessage({ id: "set" })
          }
        />
      </Container>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares(
    context,
    [
      tracingMiddleware(getTracer()),
      rateLimitingMiddleware(getTracer(), logger, rateLimitingConfig),
      recoveryMiddleware(getTracer()),
      sentryMiddleware(getTracer()),
      errorMiddleware(getTracer()),
      loggingMiddleware(getTracer(), logger),
      authMiddleware(getTracer()),
      verifySudoModeMiddleware(getTracer(), context.resolvedUrl),
    ],
    "/account/security/update",
  );
};

export { getServerSideProps };
export default SecurityUpdatePage;
