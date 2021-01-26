import { ServerResponse } from "http";
import { GetServerSideProps } from "next";
import React from "react";

import { IdentityTypes } from "@lib/@types/Identity";
import { Container } from "@src/components/containers/container";
import { ValidateIdentityForm } from "@src/components/forms/validate-identity-form/validate-identity-form";
import { NavigationBreadcrumbs } from "@src/components/navigation-breadcrumbs/navigation-breadcrumbs";
import { Layout } from "@src/components/page-layout";
import { withAuth } from "@src/middlewares/with-auth";
import { withLogger } from "@src/middlewares/with-logger";
import { withSentry } from "@src/middlewares/with-sentry";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  return wrapMiddlewaresForSSR<{ type: string }>(
    context,
    [withLogger, withSentry, withAuth],
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
