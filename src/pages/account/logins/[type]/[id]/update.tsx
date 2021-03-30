import {
  Identity,
  IdentityTypes,
  getIdentities,
  GraphqlErrors,
  ConnectUnreachableError,
} from "@fewlines/connect-management";
import { getServerSideCookies, HttpStatus } from "@fwl/web";
import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
  rateLimitingMiddleware,
} from "@fwl/web/dist/middlewares";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import { GetServerSideProps } from "next";
import React from "react";

import { UserCookie } from "@src/@types/user-cookie";
import { Container } from "@src/components/containers/container";
import { UpdateIdentityForm } from "@src/components/forms/update-identity-form";
import { Layout } from "@src/components/page-layout";
import { config } from "@src/config";
import { logger } from "@src/config/logger";
import getTracer from "@src/config/tracer";
import { NoUserFoundError } from "@src/errors";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import { ERRORS_DATA, webErrorFactory } from "@src/web-errors";

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

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares<{ type: string }>(
    context,
    [
      tracingMiddleware(getTracer()),
      rateLimitingMiddleware(getTracer(), logger, {
        windowMs: 300000,
        requestsUntilBlock: 200,
      }),
      recoveryMiddleware(getTracer()),
      sentryMiddleware(getTracer()),
      errorMiddleware(getTracer()),
      loggingMiddleware(getTracer(), logger),
      authMiddleware(getTracer()),
    ],
    "/account/logins/[type]/[id]/update",
    async (request, response) => {
      if (!context?.params?.id) {
        response.statusCode = HttpStatus.NOT_FOUND;
        response.end();
        return;
      }

      const webErrors = {
        identityNotFound: ERRORS_DATA.IDENTITY_NOT_FOUND,
        connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
      };

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
        )
          .then((identities) => {
            return identities.find(
              (userIdentity) => userIdentity.id === identityId,
            );
          })
          .catch((error) => {
            if (error instanceof GraphqlErrors) {
              throw webErrorFactory({
                ...webErrors.identityNotFound,
                parentError: error,
              });
            }

            if (error instanceof ConnectUnreachableError) {
              throw webErrorFactory({
                ...webErrors.connectUnreachable,
                parentError: error,
              });
            }

            throw error;
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
