import {
  ScopesNotSupportedError,
  UnreachableError,
} from "@fewlines/connect-client";
import {
  ConnectUnreachableError,
  getProviderName,
  GraphqlErrors,
} from "@fewlines/connect-management";
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

import { Main } from "@src/components/page-layout";
import { Home } from "@src/components/pages/home/home";
import { config } from "@src/config";
import { oauth2Client } from "@src/config";
import { logger } from "@src/config/logger";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import getTracer from "@src/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/web-errors";

type HomePageProps = { authorizeURL: string; providerName: string };

const HomePage: React.FC<HomePageProps> = ({ authorizeURL, providerName }) => {
  return (
    <Main>
      <Home authorizeURL={authorizeURL} providerName={providerName} />
    </Main>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares<{
    authorizeURL: string;
    providerName: string;
  }>(
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
    ],
    "/",
    async () => {
      const webErrors = {
        identityNotFound: ERRORS_DATA.IDENTITY_NOT_FOUND,
        connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
        unreachable: ERRORS_DATA.UNREACHABLE,
        badRequest: ERRORS_DATA.BAD_REQUEST,
      };

      const authorizeURL = await oauth2Client
        .getAuthorizationURL()
        .catch((error) => {
          if (error instanceof ScopesNotSupportedError) {
            throw webErrorFactory(webErrors.badRequest);
          }

          if (error instanceof UnreachableError) {
            throw webErrorFactory({
              ...webErrors.unreachable,
              parentError: error,
            });
          }

          throw error;
        });

      const providerName = await getProviderName(
        config.managementCredentials,
      ).catch((error) => {
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

      return {
        props: {
          authorizeURL: authorizeURL.toString(),
          providerName,
        },
      };
    },
  );
};

export { getServerSideProps };
export default HomePage;
