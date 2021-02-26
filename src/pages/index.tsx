import { getProviderName } from "@fewlines/connect-management";
import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
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
      recoveryMiddleware(getTracer()),
      sentryMiddleware(getTracer()),
      errorMiddleware(getTracer()),
      loggingMiddleware(getTracer(), logger),
    ],
    "/",
    async () => {
      const authorizeURL = await oauth2Client.getAuthorizationURL();

      const providerName = await getProviderName(config.managementCredentials);

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
