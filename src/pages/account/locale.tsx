import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";
import { useIntl } from "react-intl";

import { Layout } from "@src/components/page-layout";
import { Locale } from "@src/components/pages/locale";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";

const LocalePage: React.FC = () => {
  const { formatMessage } = useIntl();

  return (
    <Layout breadcrumbs={false} title={formatMessage({ id: "title" })}>
      <Locale />
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares(
    context,
    basicMiddlewares(getTracer(), logger),
    "/account/locale/",
  );
};

export { getServerSideProps };
export default LocalePage;
