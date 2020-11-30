import { GetServerSideProps } from "next";
import React from "react";

import { IdentityTypes } from "@lib/@types";
import { Layout } from "@src/components/Layout";
import { AddIdentity } from "@src/components/business/AddIdentity";
import { AddIdentityForm } from "@src/components/display/fewlines/AddIdentityForm/AddIdentityForm";
import { Container } from "@src/components/display/fewlines/Container";
import { H1 } from "@src/components/display/fewlines/H1/H1";
import { NavigationBreadcrumbs } from "@src/components/display/fewlines/NavigationBreadcrumbs/NavigationBreadcrumbs";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";

const AddIdentityPage: React.FC<{ type: IdentityTypes }> = ({ type }) => {
  return (
    <Layout>
      <Container>
        <H1>Logins</H1>
        <NavigationBreadcrumbs
          breadcrumbs={[
            type.toLocaleUpperCase() === IdentityTypes.EMAIL
              ? "Email address"
              : "Phone number",
            "new",
          ]}
        />
        <AddIdentity type={type}>
          {({ addIdentity }) => (
            <AddIdentityForm type={type} addIdentity={addIdentity} />
          )}
        </AddIdentity>
      </Container>
    </Layout>
  );
};

export default AddIdentityPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return wrapMiddlewaresForSSR<{ type: string }>(
    context,
    [withLogger, withSentry, withSession, withAuth],
    async () => {
      return {
        props: {
          type: context.params?.type?.toString(),
        },
      };
    },
  );
};
