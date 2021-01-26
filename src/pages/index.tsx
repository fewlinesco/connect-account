import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
} from "@fwl/web/dist/middlewares";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import { GetServerSideProps } from "next";
import React from "react";

import { getProviderName } from "@lib/queries/get-provider-name";
import { NoDataReturned, NoProviderNameFound } from "@src/client-errors";
import { Home } from "@src/components/home/home";
import { Main } from "@src/components/layout";
import { oauth2Client } from "@src/config";
import { GraphqlErrors } from "@src/errors";
import { logger } from "@src/logger";
import { withSentry } from "@src/middlewares/with-sentry";
import getTracer from "@src/tracer";

type HomePageProps = { authorizeURL: string; providerName: string };

const HomePage: React.FC<HomePageProps> = ({ authorizeURL, providerName }) => {
  return (
    <Main>
      <Home authorizeURL={authorizeURL} providerName={providerName} />
    </Main>
  );
};

export default HomePage;

const tracer = getTracer();

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares<{
    authorizeURL: string;
    providerName: string;
  }>(
    context,
    [
      tracingMiddleware(tracer),
      recoveryMiddleware(tracer),
      errorMiddleware(tracer),
      loggingMiddleware(tracer, logger),
      withSentry,
    ],
    async () => {
      const authorizeURL = await oauth2Client.getAuthorizationURL();

      const providerName = await getProviderName().then(({ errors, data }) => {
        if (errors) {
          throw new GraphqlErrors(errors);
        }

        if (!data) {
          throw new NoDataReturned();
        }

        const providerName = data.provider.name;

        if (!providerName) {
          throw new NoProviderNameFound();
        }

        return providerName;
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
