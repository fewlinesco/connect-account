import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";

import { Container } from "@src/components/containers/container";
import { UserAddressForm } from "@src/components/forms/profile/user-address-form";
import { Layout } from "@src/components/page-layout";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";

const NewAddressPage: React.FC = () => {
  return (
    <Layout breadcrumbs="Address | new" title="Personal information">
      <Container>
        <UserAddressForm isCreation={true} />
      </Container>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares(
    context,
    basicMiddlewares(getTracer(), logger),
    "account/profile/addresses",
    () => {
      return {
        props: {},
      };
    },
  );
};

export { getServerSideProps };
export default NewAddressPage;
