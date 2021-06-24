import { IdentityTypes } from "@fewlines/connect-management";
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
import { useIntl } from "react-intl";

import { Container } from "@src/components/containers/container";
import { AddIdentityForm } from "@src/components/forms/identities/add-identity-form";
import { Layout } from "@src/components/page-layout";
import { logger } from "@src/configs/logger";
import rateLimitingConfig from "@src/configs/rate-limiting-config";
import getTracer from "@src/configs/tracer";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import { getIdentityType } from "@src/utils/get-identity-type";

const AddIdentityPage: React.FC<{ type: IdentityTypes }> = ({ type }) => {
  const { formatMessage } = useIntl();

  return (
    <Layout
      breadcrumbs={
        getIdentityType(type) === IdentityTypes.EMAIL
          ? formatMessage({ id: "emailBreadcrumb" })
          : formatMessage({ id: "phoneBreadcrumb" })
      }
      title={formatMessage({ id: "title" })}
    >
      <Container>
        <AddIdentityForm type={type} />
      </Container>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares<{ type: string }>(
    context,
    [
      tracingMiddleware(getTracer()),
      rateLimitingMiddleware(getTracer(), logger, rateLimitingConfig),
      recoveryMiddleware(getTracer()),
      sentryMiddleware(getTracer()),
      errorMiddleware(getTracer()),
      loggingMiddleware(getTracer(), logger),
      authMiddleware(getTracer()),
    ],
    "/account/logins/[type]/new",
    () => {
      if (!context?.params?.type) {
        return {
          notFound: true,
        };
      }

      if (!["email", "phone"].includes(context.params.type.toString())) {
        return {
          notFound: true,
        };
      }

      return {
        props: {
          type: context.params.type.toString(),
        },
      };
    },
  );
};

export { getServerSideProps };
export default AddIdentityPage;
