import { GetServerSideProps } from "next";
import React from "react";

import { IdentityTypes } from "@lib/@types";
import { Layout } from "@src/components/Layout";
import { AddIdentityForm } from "@src/components/display/fewlines/AddIdentityForm/AddIdentityForm";
import { Container } from "@src/components/display/fewlines/Container";
import { NavigationBreadcrumbs } from "@src/components/display/fewlines/NavigationBreadcrumbs/NavigationBreadcrumbs";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";
import { getIdentityType } from "@src/utils/getIdentityType";

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
