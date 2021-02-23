import { IdentityTypes } from "@fewlines/connect-management";
import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
} from "@fwl/web/dist/middlewares";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import { GetServerSideProps } from "next";
import React from "react";

import { Container } from "@src/components/containers/container";
import { AddIdentityForm } from "@src/components/forms/add-identity-form";
import { Layout } from "@src/components/page-layout";
import { logger } from "@src/logger";
import { withAuth } from "@src/middlewares/with-auth";
import { withSentry } from "@src/middlewares/with-sentry";
import getTracer from "@src/tracer";
import { getIdentityType } from "@src/utils/get-identity-type";

const AddIdentityPage: React.FC<{ type: IdentityTypes }> = ({ type }) => {
  return (
    <Layout
      title="Logins"
      breadcrumbs={[
        getIdentityType(type) === IdentityTypes.EMAIL
          ? "Email address"
          : "Phone number",
        "new",
      ]}
    >
      <Container>
        <AddIdentityForm type={type} />
      </Container>
    </Layout>
  );
};

const tracer = getTracer();

const getServerSideProps: GetServerSideProps = async (context) => {
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
    "/account/logins/[type]/new",
    async () => {
      if (!context?.params?.type) {
        context.res.statusCode = 400;
        context.res.end();
        return;
      }

      if (!["email", "phone"].includes(context.params.type.toString())) {
        return {
          notFound: true,
        };
      }

      return {
        props: {
          type: context.params?.type?.toString(),
        },
      };
    },
  );
};

export { getServerSideProps };
export default AddIdentityPage;
