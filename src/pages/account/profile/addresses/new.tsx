import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";
import { useIntl } from "react-intl";

import { UserAddressForm } from "@src/components/forms/profile/user-address-form";
import { Layout } from "@src/components/page-layout";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";

const NewAddressPage: React.FC = () => {
  const { formatMessage } = useIntl();

  return (
    <Layout
      breadcrumbs={formatMessage({ id: "breadcrumb" })}
      title={formatMessage({ id: "title" })}
    >
      <UserAddressForm isCreation={true} />
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares(
    context,
    basicMiddlewares(getTracer(), logger),
    "account/profile/addresses/",
    () => {
      return {
        props: {},
      };
    },
  );
};

export { getServerSideProps };
export default NewAddressPage;
