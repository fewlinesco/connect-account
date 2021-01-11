import { GetServerSideProps } from "next";
import React from "react";

import { IdentityTypes } from "@lib/@types";
import { AddIdentityForm } from "@src/components/add-identity-form/add-identity-form";
import { Container } from "@src/components/containers/container";
import { Layout } from "@src/components/layout-remove";
import { NavigationBreadcrumbs } from "@src/components/navigation-breadcrumbs/navigation-breadcrumbs";
import { withAuth } from "@src/middlewares/with-auth";
import { withLogger } from "@src/middlewares/with-logger";
import { withSentry } from "@src/middlewares/with-sentry";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";
import { getIdentityType } from "@src/utils/get-identity-type";

const AddIdentityPage: React.FC<{ type: IdentityTypes }> = ({ type }) => {
  return (
    <Layout>
      <Container>
        <h1>Logins</h1>
        <NavigationBreadcrumbs
          breadcrumbs={[
            getIdentityType(type) === IdentityTypes.EMAIL
              ? "Email address"
              : "Phone number",
            "new",
          ]}
        />
        <AddIdentityForm type={type} />
      </Container>
    </Layout>
  );
};

export default AddIdentityPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return wrapMiddlewaresForSSR<{ type: string }>(
    context,
    [withLogger, withSentry, withAuth],
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
