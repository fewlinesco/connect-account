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
import { logger } from "@src/logger";
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
        windowMs: 5000,
        requestsUntilBlock: 20,
      }),
      recoveryMiddleware(getTracer()),
      sentryMiddleware(getTracer()),
      errorMiddleware(getTracer()),
      loggingMiddleware(getTracer(), logger),
    ],
    "/",
    async () => {
      const webErrors = {
        badRequest: ERRORS_DATA.BAD_REQUEST,
        identityNotFound: ERRORS_DATA.IDENTITY_NOT_FOUND,
        connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
      };

      const authorizeURL = await oauth2Client.getAuthorizationURL();

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
