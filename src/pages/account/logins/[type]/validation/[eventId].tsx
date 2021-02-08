import { IdentityTypes } from "@fewlines/connect-management";
import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
} from "@fwl/web/dist/middlewares";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import { ServerResponse } from "http";
import { GetServerSideProps } from "next";
import React from "react";

import { Container } from "@src/components/containers/container";
import { ValidateIdentityForm } from "@src/components/forms/validate-identity-form";
import { NavigationBreadcrumbs } from "@src/components/navigation-breadcrumbs/navigation-breadcrumbs";
import { Layout } from "@src/components/page-layout";
import { logger } from "@src/logger";
import { withAuth } from "@src/middlewares/with-auth";
import { withSentry } from "@src/middlewares/with-sentry";
import getTracer from "@src/tracer";

const ValidateIdentityPage: React.FC<{
  type: IdentityTypes;
  eventId: string;
}> = ({ type, eventId }) => {
  return (
    <Layout>
      <Container>
        <h1>Logins</h1>
        <NavigationBreadcrumbs
          breadcrumbs={[
            type.toUpperCase() === IdentityTypes.EMAIL
              ? "Email address"
              : "Phone number",
            "validation",
          ]}
        />
        <ValidateIdentityForm type={type} eventId={eventId} />
      </Container>
    </Layout>
  );
};

export default ValidateIdentityPage;

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
    async (_request, response: ServerResponse) => {
      if (!context?.params?.type) {
        response.statusCode = 400;
        response.end();
        return;
      }
      if (!context?.params?.eventId) {
        response.statusCode = 400;
        response.end();
        return;
      }

      return {
        props: {
          type: context.params.type,
          eventId: context.params.eventId,
        },
      };
    },
  );
};
