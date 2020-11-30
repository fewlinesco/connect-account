import { ServerResponse } from "http";
import { GetServerSideProps } from "next";
import React from "react";

import { Identity, IdentityTypes } from "@lib/@types";
import { getIdentities } from "@lib/queries/getIdentities";
import { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { Layout } from "@src/components/Layout";
import { UpdateIdentity } from "@src/components/business/UpdateIdentity";
import { Container } from "@src/components/display/fewlines/Container";
import { H1 } from "@src/components/display/fewlines/H1/H1";
import { NavigationBreadcrumbs } from "@src/components/display/fewlines/NavigationBreadcrumbs/NavigationBreadcrumbs";
import { UpdateIdentityForm } from "@src/components/display/fewlines/UpdateIdentityForm/UpdateIdentityForm";
import { GraphqlErrors } from "@src/errors";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";
import { getUser } from "@src/utils/getUser";

const UpdateIdentityPage: React.FC<{ identity: Identity }> = ({ identity }) => {
  return (
    <Layout>
      <Container>
        <H1>Logins</H1>
        <NavigationBreadcrumbs
          breadcrumbs={[
            identity.type.toUpperCase() === IdentityTypes.EMAIL
              ? "Email address"
              : "Phone number",
            "edit",
          ]}
        />
        <UpdateIdentity identity={identity}>
          {({ updateIdentity }) => (
            <UpdateIdentityForm
              updateIdentity={updateIdentity}
              currentIdentity={identity}
            />
          )}
        </UpdateIdentity>
      </Container>
    </Layout>
  );
};

export default UpdateIdentityPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return wrapMiddlewaresForSSR<{ type: string }>(
    context,
    [withLogger, withSentry, withSession, withAuth],
    async (request: ExtendedRequest, response: ServerResponse) => {
      if (!context?.params?.id) {
        response.statusCode = 400;
        response.end();
        return;
      }
      const userId = context.params.id.toString();

      const user = await getUser(request.headers.cookie as string);

      if (user) {
        const identity = await getIdentities(user.sub).then((result) => {
          if (result.errors) {
            throw new GraphqlErrors(result.errors);
          }

          const res = result.data?.provider.user.identities.filter(
            (id) => id.id === userId,
          )[0];

          return res;
        });

        return {
          props: {
            identity,
          },
        };
      } else {
        throw new Error("No User found");
      }
    },
  );
};
