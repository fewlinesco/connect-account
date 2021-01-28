import {
  Identity,
  IdentityTypes,
  getIdentities,
} from "@fewlines/connect-management";
import { GetServerSideProps } from "next";
import React from "react";

import { UserCookie } from "@src/@types/user-cookie";
import { NoUserFound } from "@src/client-errors";
import { Container } from "@src/components/containers/container";
import { NavigationBreadcrumbs } from "@src/components/navigation-breadcrumbs/navigation-breadcrumbs";
import { Layout } from "@src/components/page-layout";
import { config } from "@src/config";
import { withAuth } from "@src/middlewares/with-auth";
import { withLogger } from "@src/middlewares/with-logger";
import { withSentry } from "@src/middlewares/with-sentry";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";
import { getServerSideCookies } from "@src/utils/server-side-cookies";

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
        {/* <UpdateIdentityForm currentIdentity={identity} /> */}
      </Container>
    </Layout>
  );
};

export default UpdateIdentityPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return wrapMiddlewaresForSSR<{ type: string }>(
    context,
    [withLogger, withSentry, withAuth],
    async (request, response) => {
      if (!context?.params?.id) {
        response.statusCode = 400;
        response.end();
        return;
      }

      const identityId = context.params.id.toString();

      const userCookie = await getServerSideCookies<UserCookie>(request, {
        cookieName: "user-cookie",
        isCookieSealed: true,
      });

      if (userCookie) {
        const identity = await getIdentities(
          config.managementCredentials,
          userCookie.sub,
        ).then((identities) => {
          return identities.filter(
            (userIdentity) => userIdentity.id === identityId,
          )[0];
        });

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
