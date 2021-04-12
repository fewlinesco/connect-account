import { Identity, IdentityTypes } from "@fewlines/connect-management";
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
import { Layout } from "@src/components/page-layout";
import { IdentityOverview } from "@src/components/pages/identity-overview/identity-overview";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { SWRError } from "@src/errors/errors";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import { getIdentityType } from "@src/utils/get-identity-type";

const IdentityOverviewPage: React.FC<{
  identityId: string;
}> = ({ identityId }) => {
  const { data, error } = useSWR<{ identity: Identity }, SWRError>(
    `/api/identity/get-identity?identityId=${identityId}`,
  );

  if (error) {
    throw error;
  }

  const breadcrumbs = data
    ? getIdentityType(data.identity.type) === IdentityTypes.EMAIL
      ? "Email address"
      : "Phone number"
    : "";

  return (
    <Layout title="Logins" breadcrumbs={breadcrumbs}>
      <Container>
        <IdentityOverview data={data} />
      </Container>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares<{ identityId: string }>(
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
    () => {
      if (!context?.params?.id) {
        return {
          notFound: true,
        };
      }

      return {
        props: {
          identityId: context.params.id,
        },
      };
    },
  );
};

export { getServerSideProps };
export default IdentityOverviewPage;
