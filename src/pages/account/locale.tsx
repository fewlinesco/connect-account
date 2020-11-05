import type { GetServerSideProps } from "next";
import React from "react";

import { Layout } from "@src/components/Layout";
import { Locale } from "@src/components/display/fewlines/Locale/Locale";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withMongoDB } from "@src/middlewares/withMongoDB";
import { withSentry } from "@src/middlewares/withSentry";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";

const LocalePage: React.FC = () => {
  return (
    <Layout>
      <Locale />
    </Layout>
  );
};

export default LocalePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return wrapMiddlewaresForSSR(context, [
    withLogger,
    withSentry,
    withSession,
    withMongoDB,
    withAuth,
  ]);
};
