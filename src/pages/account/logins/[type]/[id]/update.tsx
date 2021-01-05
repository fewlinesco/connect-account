import { ServerResponse } from "http";
import { GetServerSideProps } from "next";
import React from "react";

import { Identity, IdentityTypes } from "@lib/@types";
import { getIdentities } from "@lib/queries/getIdentities";
import { UserCookie } from "@src/@types/UserCookie";
import { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import {
  NoDataReturned,
  NoIdentityFound,
  NoUserFound,
} from "@src/clientErrors";
import { Layout } from "@src/components/Layout";
import { Container } from "@src/components/display/fewlines/Container";
import { NavigationBreadcrumbs } from "@src/components/display/fewlines/NavigationBreadcrumbs/NavigationBreadcrumbs";
import { GraphqlErrors } from "@src/errors";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";

const UpdateIdentityPage: React.FC<{ identity: Identity }> = ({ identity }) => {
  return (
    <Layout>
      <Container>
        <h1>Logins</h1>
        <NavigationBreadcrumbs
          breadcrumbs={[
            identity.type.toUpperCase() === IdentityTypes.EMAIL
              ? "Email address"
              : "Phone number",
            "edit",
          ]}
        />
        {/* <UpdateIdentity identity={identity}>
          {({ updateIdentity }) => (
            <UpdateIdentityForm
              updateIdentity={updateIdentity}
              currentIdentity={identity}
            />
          )}
        </UpdateIdentity> */}
      </Container>
    </Layout>
  );
};

export default UpdateIdentityPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return wrapMiddlewaresForSSR<{ type: string }>(
    context,
    [withLogger, withSentry, withAuth],
    async (request: ExtendedRequest, response: ServerResponse) => {
      if (!context?.params?.id) {
        response.statusCode = 400;
        response.end();
        return;
      }

      const identityId = context.params.id.toString();
      const userCookie = request.session.get<UserCookie>("user-cookie");

      if (userCookie) {
        const identity = await getIdentities(userCookie.sub).then(
          ({ errors, data }) => {
            if (errors) {
              throw new GraphqlErrors(errors);
            }

            if (!data) {
              throw new NoDataReturned();
            }

            const identities = data.provider.user.identities;

            if (!identities) {
              throw new NoIdentityFound();
            }

            return identities.filter(
              (userIdentity) => userIdentity.id === identityId,
            )[0];
          },
        );

        if (!identity) {
          return {
            notFound: true,
          };
        }

        return {
          props: {
            identity,
          },
        };
      } else {
        throw new NoUserFound();
      }
    },
  );
};
