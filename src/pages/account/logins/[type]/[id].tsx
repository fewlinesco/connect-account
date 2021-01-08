import type { GetServerSideProps } from "next";
import React from "react";

import { Identity, IdentityTypes } from "@lib/@types";
import { getIdentity } from "@lib/queries/getIdentity";
import { UserCookie } from "@src/@types/UserCookie";
import { NoDataReturned, NoIdentityFound } from "@src/clientErrors";
import { Layout } from "@src/components/Layout";
import { Container } from "@src/components/display/fewlines/Container";
import { IdentityOverview } from "@src/components/display/fewlines/IdentityOverview/IdentityOverview";
import { NavigationBreadcrumbs } from "@src/components/display/fewlines/NavigationBreadcrumbs/NavigationBreadcrumbs";
import { GraphqlErrors } from "@src/errors";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";
import { getServerSideCookies } from "@src/utils/serverSideCookies";

const IdentityOverviewPage: React.FC<{
  identity: Identity;
  userId: string;
}> = ({ identity, userId }) => {
  const { type } = identity;

  return (
    <Layout>
      <Container>
        <h1>Logins</h1>
        <NavigationBreadcrumbs
          breadcrumbs={[
            type.toUpperCase() === IdentityTypes.EMAIL
              ? "Email address"
              : "Phone number",
          ]}
        />
        <IdentityOverview identity={identity} userId={userId} />
      </Container>
    </Layout>
  );
};

export default IdentityOverviewPage;

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

      const userCookie = await getServerSideCookies<UserCookie>(
        request,
        "user-cookie",
        true,
      );

      if (userCookie) {
        const identity = await getIdentity(
          userCookie.sub,
          context.params.id.toString(),
        ).then(({ errors, data }) => {
          if (errors) {
            throw new GraphqlErrors(errors);
          }

          if (!data) {
            throw new NoDataReturned();
          }

          if (!data.provider.user.identity) {
            throw new NoIdentityFound();
          }

          return data.provider.user.identity;
        });

        return {
          props: {
            identity,
            userId: userCookie.sub,
          },
        };
      }

      return { props: {} };
    },
  );
};
