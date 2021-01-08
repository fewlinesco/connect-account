import { GetServerSideProps } from "next";
import React from "react";

import { getProviderName } from "@lib/queries/get-provider-name";
import { NoDataReturned, NoProviderNameFound } from "@src/client-errors";
import { Main } from "@src/components/Layout";
import { Home } from "@src/components/display/fewlines/Home/Home";
import { oauth2Client } from "@src/config";
import { GraphqlErrors } from "@src/errors";
import { withLogger } from "@src/middlewares/with-logger";
import { withSentry } from "@src/middlewares/with-sentry";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";

type HomePageProps = { authorizeURL: string; providerName: string };

const HomePage: React.FC<HomePageProps> = ({ authorizeURL, providerName }) => {
  return (
    <Main>
      <Home authorizeURL={authorizeURL} providerName={providerName} />
    </Main>
  );
};

export default HomePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return wrapMiddlewaresForSSR(context, [withLogger, withSentry], async () => {
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
  });
};
