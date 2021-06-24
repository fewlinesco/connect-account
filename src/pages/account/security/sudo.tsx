import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";
import { useIntl } from "react-intl";

import { Container } from "@src/components/containers/container";
import { Layout } from "@src/components/page-layout";
import { TwoFA } from "@src/components/pages/two-fa/two-fa";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";

const SudoPage: React.FC = () => {
  const { formatMessage } = useIntl();

  return (
    <Layout breadcrumbs={false} title={formatMessage({ id: "title" })}>
      <Container>
        <TwoFA />
      </Container>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares<{ type: string }>(
    context,
    basicMiddlewares(getTracer(), logger),
    "/account/security/sudo",
  );
};

export { getServerSideProps };
export default SudoPage;
