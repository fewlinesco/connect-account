import { IdentityTypes } from "@fewlines/connect-management";
import { AlertMessage } from "@fwl/web";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import { GetServerSideProps } from "next";
import React from "react";

import { Container } from "@src/components/containers/container";
import { ValidateIdentityForm } from "@src/components/forms/identities/validate-identity-form";
import { Layout } from "@src/components/page-layout";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";
import { getIdentityType } from "@src/utils/get-identity-type";

const ValidateIdentityPage: React.FC<{
  type: IdentityTypes;
  eventId: string;
  alertMessages?: AlertMessage[];
}> = ({ type, eventId }) => {
  return (
    <Layout
      breadcrumbs={`${
        getIdentityType(type) === IdentityTypes.EMAIL
          ? "Email address"
          : "Phone number"
      } | validation`}
      title="Logins"
    >
      <Container>
        <ValidateIdentityForm type={type} eventId={eventId} />
      </Container>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares<{
    type: string;
    identityId: string;
  }>(
    context,
    basicMiddlewares(getTracer(), logger),
    "/account/logins/[type]/validation/[eventId]",
    () => {
      if (!context?.params?.type) {
        return {
          notFound: true,
        };
      }

      if (!context?.params?.eventId) {
        return {
          notFound: true,
        };
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

export { getServerSideProps };
export default ValidateIdentityPage;
