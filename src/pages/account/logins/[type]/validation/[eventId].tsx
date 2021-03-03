import { IdentityTypes } from "@fewlines/connect-management";
import { getServerSideCookies } from "@fwl/web";
import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
  rateLimitingMiddleware,
} from "@fwl/web/dist/middlewares";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import { ServerResponse } from "http";
import { GetServerSideProps } from "next";
import React from "react";

import { Container } from "@src/components/containers/container";
import { ValidateIdentityForm } from "@src/components/forms/validate-identity-form";
import { Layout } from "@src/components/page-layout";
import { logger } from "@src/logger";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import getTracer from "@src/tracer";

const ValidateIdentityPage: React.FC<{
  type: IdentityTypes;
  eventId: string;
  alertMessages?: string[];
}> = ({ type, eventId, alertMessages }) => {
  return (
    <Layout
      alertMessages={alertMessages}
      title="Logins"
      breadcrumbs={[
        type.toUpperCase() === IdentityTypes.EMAIL
          ? "Email address"
          : "Phone number",
        "validation",
      ]}
    >
      <Container>
        <ValidateIdentityForm type={type} eventId={eventId} />
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
    "/account/logins/[type]/validation/[eventId]",
    async (request, response: ServerResponse) => {
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

      const alertMessages = await getServerSideCookies(request, {
        cookieName: "alert-messages",
        isCookieSealed: false,
      });

      return {
        props: {
          type: context.params.type,
          eventId: context.params.eventId,
          alertMessages: alertMessages ? alertMessages : null,
        },
      };
    },
  );
};

export { getServerSideProps };
export default ValidateIdentityPage;
