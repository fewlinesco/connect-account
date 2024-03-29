import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";
import { useIntl } from "react-intl";

import { Layout } from "@src/components/page-layout";
import { Security } from "@src/components/pages/security";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";

const SecurityPage: React.FC = () => {
  const { formatMessage } = useIntl();

  return (
    <Layout
      breadcrumbs={formatMessage({ id: "breadcrumb" })}
      title={formatMessage({ id: "title" })}
    >
      <Security />
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares(
    context,
    basicMiddlewares(getTracer(), logger),
    "/account/security/",
  );
};

export { getServerSideProps };
export default SecurityPage;
