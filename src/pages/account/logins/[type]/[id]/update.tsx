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
import { UpdateIdentityForm } from "@src/components/forms/update-identity-form";
import { Layout } from "@src/components/page-layout";
import { config } from "@src/config";
import { NoUserFoundError } from "@src/errors";
import { logger } from "@src/logger";
import { withAuth } from "@src/middlewares/with-auth";
import { withSentry } from "@src/middlewares/with-sentry";
import getTracer from "@src/tracer";

const UpdateIdentityPage: React.FC<{ identity: Identity }> = ({ identity }) => {
  return (
    <Layout
      title="Logins"
      breadcrumbs={[
        identity.type.toUpperCase() === IdentityTypes.EMAIL
          ? "Email address"
          : "Phone number",
        "edit",
      ]}
    >
      <Container>
        <UpdateIdentityForm currentIdentity={identity} />
      </Container>
    </Layout>
  );
};

const tracer = getTracer();

const getServerSideProps: GetServerSideProps = async (context) => {
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
    "/account/logins/[type]/[id]/update",
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
            userId: userCookie.sub,
          },
        };
      } else {
        throw new NoUserFoundError();
      }
    },
  );
};

export { getServerSideProps };
export default UpdateIdentityPage;
