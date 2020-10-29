import { GetServerSideProps } from "next";
import React from "react";

import { IdentityTypes } from "@lib/@types";
import { AddIdentity } from "@src/components/business/AddIdentity";
import { AddIdentityForm } from "@src/components/display/fewlines/AddIdentityForm/AddIdentityForm";
import { Container } from "@src/components/display/fewlines/Container";
import { H1 } from "@src/components/display/fewlines/H1/H1";
import { NavigationBreadcrumbs } from "@src/components/display/fewlines/NavigationBreadcrumbs/NavigationBreadcrumbs";
import { withSSRLogger } from "@src/middleware/withSSRLogger";
import withSession from "@src/middleware/withSession";

const AddIdentityPage: React.FC<{ type: IdentityTypes }> = ({ type }) => {
  console.log(type);

  return (
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
  );
};

export default AddIdentityPage;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  withSession(async (context) => {
    return {
      props: {
        type: context.params.type,
      },
    };
  }),
);
