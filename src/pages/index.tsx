import { GetServerSideProps } from "next";
import React from "react";

import { getProviderName } from "@lib/queries/getProviderName";
import { ChildrenContainer, Main } from "@src/components/Layout";
import { Home } from "@src/components/display/fewlines/Home/Home";
import { oauth2Client } from "@src/config";
import { withSSRLogger } from "@src/middlewares/withSSRLogger";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";

type HomePageProps = { authorizeURL: string; providerName: string };

const HomePage: React.FC<HomePageProps> = ({ authorizeURL, providerName }) => {
  return (
    <Main>
      <ChildrenContainer>
        <Home authorizeURL={authorizeURL} providerName={providerName} />
      </ChildrenContainer>
    </Main>
  );
};

export default HomePage;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  async (context) => {
    addRequestScopeToSentry(context.req);

    try {
      const authorizeURL = await oauth2Client.getAuthorizationURL();

      const { data } = await getProviderName();

      return {
        props: {
          authorizeURL: authorizeURL.toString(),
          providerName: data?.provider.name,
        },
      };
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setTag("/pages/index SSR", "/pages/index SSR");
        Sentry.captureException(error);
      });
    }

    return { props: {} };
  },
);
