import type { GetServerSideProps } from "next";
import React from "react";

import { Layout } from "@src/components/Layout";
import { Locale } from "@src/components/locale/locale";
import { withAuth } from "@src/middlewares/with-auth";
import { withLogger } from "@src/middlewares/with-logger";
import { withSentry } from "@src/middlewares/with-sentry";
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
  return wrapMiddlewaresForSSR(context, [withLogger, withSentry, withAuth]);
};
