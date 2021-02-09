import {
  Identity,
  IdentityTypes,
  getIdentities,
} from "@fewlines/connect-management";
import { getServerSideCookies } from "@fwl/web";
import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
} from "@fwl/web/dist/middlewares";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import { GetServerSideProps } from "next";
import React from "react";

import { UserCookie } from "@src/@types/user-cookie";
import { Container } from "@src/components/containers/container";
import { NavigationBreadcrumbs } from "@src/components/navigation-breadcrumbs/navigation-breadcrumbs";
import { Layout } from "@src/components/page-layout";
import { config } from "@src/config";
import { NoUserFound } from "@src/errors";
import { logger } from "@src/logger";
import { withAuth } from "@src/middlewares/with-auth";
import { withSentry } from "@src/middlewares/with-sentry";
import getTracer from "@src/tracer";

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

const tracer = getTracer();

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares<{ type: string }>(
    context,
    [
      tracingMiddleware(tracer),
      recoveryMiddleware(tracer),
      errorMiddleware(tracer),
      loggingMiddleware(tracer, logger),
      withSentry,
      withAuth,
    ],
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
        cookieSalt: config.cookieSalt,
      });

      if (userCookie) {
        const identity = await getIdentities(
          config.managementCredentials,
          userCookie.sub,
        ).then((identities) => {
          return identities.find(
            (userIdentity) => userIdentity.id === identityId,
          );
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
