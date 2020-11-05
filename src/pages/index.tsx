import { GetServerSideProps } from "next";
import React from "react";

import { getProviderName } from "@lib/queries/getProviderName";
import { Main } from "@src/components/Layout";
import { Home } from "@src/components/display/fewlines/Home/Home";
import { oauth2Client } from "@src/config";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
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

    const { data } = await getProviderName();

    return {
      props: {
        authorizeURL: authorizeURL.toString(),
        providerName: data?.provider.name,
      },
    };
  });
};
