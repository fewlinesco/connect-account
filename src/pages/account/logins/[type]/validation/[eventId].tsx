import { ServerResponse } from "http";
import { GetServerSideProps } from "next";
import React from "react";

import { IdentityTypes } from "@lib/@types/Identity";
import { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { Layout } from "@src/components/Layout";
import { Container } from "@src/components/display/fewlines/Container";
import { NavigationBreadcrumbs } from "@src/components/display/fewlines/NavigationBreadcrumbs/NavigationBreadcrumbs";
import { ValidateIdentityForm } from "@src/components/display/fewlines/ValidateIdentityForm/ValidateIdentityForm";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
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
    async (request: ExtendedRequest, response: ServerResponse) => {
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
