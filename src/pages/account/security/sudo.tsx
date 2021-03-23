import {
  ConnectUnreachableError,
  getIdentities,
  GraphqlErrors,
  Identity,
  IdentityTypes,
} from "@fewlines/connect-management";
import { getServerSideCookies } from "@fwl/web";
import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
  rateLimitingMiddleware,
} from "@fwl/web/dist/middlewares";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";

import { UserCookie } from "@src/@types/user-cookie";
import { Container } from "@src/components/containers/container";
import { Layout } from "@src/components/page-layout";
import { TwoFA } from "@src/components/pages/two-fa/two-fa";
import { config } from "@src/config";
import { logger } from "@src/logger";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import getTracer from "@src/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/web-errors";

const SudoPage: React.FC<{ primaryIdentities: Identity[] }> = ({
  primaryIdentities,
}) => {
  return (
    <Layout title="Security">
      <Container>
        <TwoFA primaryIdentities={primaryIdentities} />
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
    "/account/security/sudo",
    async (request) => {
      const webErrors = {
        identityNotFound: ERRORS_DATA.IDENTITY_NOT_FOUND,
        connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
      };

      const userCookie = await getServerSideCookies<UserCookie>(request, {
        cookieName: "user-cookie",
        isCookieSealed: true,
        cookieSalt: config.cookieSalt,
      });

      if (userCookie) {
        const primaryIdentities = await getIdentities(
          config.managementCredentials,
          userCookie.sub,
        )
          .then((identities) => {
            return identities.filter((identity) => {
              return (
                identity.primary &&
                (identity.type == IdentityTypes.EMAIL.toLowerCase() ||
                  identity.type == IdentityTypes.PHONE.toLowerCase())
              );
            });
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

        if (primaryIdentities.length > 1) {
          return {
            props: {
              primaryIdentities,
            },
          };
        }
      }

      return { props: {} };
    },
  );
};

export { getServerSideProps };
export default SudoPage;