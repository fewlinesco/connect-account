import { Identity, IdentityTypes } from "@fewlines/connect-management";
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
import useSWR from "swr";

import { Container } from "@src/components/containers/container";
import { UpdateIdentityForm } from "@src/components/forms/update-identity-form";
import { Layout } from "@src/components/page-layout";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";

const UpdateIdentityPage: React.FC<{ identityId: string }> = ({
  identityId,
}) => {
  const { data, error } = useSWR<{ identity: Identity }, Error>(
    `/api/identity/get-identity?identityId=${identityId}`,
  );

  if (error) {
    throw error;
  }

  const breadcrumbs = data
    ? data.identity.type.toUpperCase() === IdentityTypes.EMAIL
      ? "Email address"
      : "Phone number"
    : "";
  return (
    <Layout title="Logins" breadcrumbs={`${breadcrumbs} | edit`}>
      <Container>
        <UpdateIdentityForm currentIdentity={identity} />
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
    "/account/logins/[type]/[id]/update",
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
export default UpdateIdentityPage;
