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
import { UpdateIdentityForm } from "@src/components/forms/identities/update-identity-form";
import { Layout } from "@src/components/page-layout";
import { logger } from "@src/configs/logger";
import rateLimitinConfig from "@src/configs/rate-limiting-config";
import getTracer from "@src/configs/tracer";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";

const UpdateIdentityPage: React.FC<{ identityId: string }> = ({
  identityId,
}) => {
  const { data: identity, error } = useSWR<Identity, Error>(
    `/api/identities/${identityId}`,
  );

  if (error) {
    throw error;
  }

  const breadcrumbs = identity
    ? identity.type.toUpperCase() === IdentityTypes.EMAIL
      ? "Email address | edit"
      : "Phone number | edit"
    : "";

  return (
    <Layout breadcrumbs={breadcrumbs} title="Logins">
      <Container>
        <UpdateIdentityForm identity={identity} />
      </Container>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares<{ identityId: string }>(
    context,
    [
      tracingMiddleware(getTracer()),
      rateLimitingMiddleware(getTracer(), logger, rateLimitinConfig),
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
