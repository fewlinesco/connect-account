import { ServerResponse } from "http";
import { GetServerSideProps } from "next";
import React from "react";

import { IdentityTypes } from "@lib/@types/Identity";
import { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { Layout } from "@src/components/Layout";
import { ValidateIdentity } from "@src/components/business/ValidateIdentity";
import { Container } from "@src/components/display/fewlines/Container";
import { H1 } from "@src/components/display/fewlines/H1/H1";
import { NavigationBreadcrumbs } from "@src/components/display/fewlines/NavigationBreadcrumbs/NavigationBreadcrumbs";
import { ValidateIdentityForm } from "@src/components/display/fewlines/ValidateIdentityForm/ValidateIdentityForm";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withMongoDB } from "@src/middlewares/withMongoDB";
import { withSentry } from "@src/middlewares/withSentry";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";

const ValidateIdentityPage: React.FC<{
  type: IdentityTypes;
  eventId: string;
}> = ({ type, eventId }) => {
  return (
    <Layout>
      <Container>
        <H1>Logins</H1>
        <NavigationBreadcrumbs
          breadcrumbs={[
            type.toUpperCase() === IdentityTypes.EMAIL
              ? "Email address"
              : "Phone number",
            "validation",
          ]}
        />
        <ValidateIdentity eventId={eventId}>
          {({ validateIdentity }) => (
            <ValidateIdentityForm
              type={type}
              validateIdentity={validateIdentity}
            />
          )}
        </ValidateIdentity>
      </Container>
    </Layout>
  );
};

export default ValidateIdentityPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return wrapMiddlewaresForSSR<{ type: string }>(
    context,
    [withLogger, withSentry, withMongoDB, withSession, withAuth],
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
