import { ServerResponse } from "http";
import type { GetServerSideProps } from "next";
import React from "react";

import { Identity, IdentityTypes } from "@lib/@types";
import { getIdentity } from "@lib/queries/getIdentity";
import { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { NoIdentityFound } from "@src/clientErrors";
import { Layout } from "@src/components/Layout";
import { Container } from "@src/components/display/fewlines/Container";
import { H1 } from "@src/components/display/fewlines/H1/H1";
import { IdentityOverview } from "@src/components/display/fewlines/IdentityOverview/IdentityOverview";
import { NavigationBreadcrumbs } from "@src/components/display/fewlines/NavigationBreadcrumbs/NavigationBreadcrumbs";
import { GraphqlErrors } from "@src/errors";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";
import { getUser } from "@src/utils/getUser";

const IdentityOverviewPage: React.FC<{ identity: Identity }> = ({
  identity,
}) => {
  const { type } = identity;

  return (
    <Layout>
      <Container>
        <H1>Logins</H1>
        <NavigationBreadcrumbs
          breadcrumbs={[
            type.toUpperCase() === IdentityTypes.EMAIL
              ? "Email address"
              : "Phone number",
          ]}
        />
        <IdentityOverview identity={identity} />
      </Container>
    </Layout>
  );
};

export default IdentityOverviewPage;

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

      const user = await getUser(request.headers.cookie as string);

      if (user) {
        const identity = await getIdentity(
          user.sub,
          context.params.id.toString(),
        ).then((result) => {
          if (result.errors) {
            throw new GraphqlErrors(result.errors);
          }

          if (result.data && !result.data.provider.user.identity) {
            throw new NoIdentityFound();
          }

          return result.data?.provider.user.identity;
        });

        return {
          props: {
            identity,
          },
        };
      }

      return { props: {} };
    },
  );
};
