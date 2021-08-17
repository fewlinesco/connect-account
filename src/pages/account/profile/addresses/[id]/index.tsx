import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";
import { useIntl } from "react-intl";
import useSWR from "swr";

import { Address } from "@src/@types/profile";
import { Layout } from "@src/components/page-layout";
import { AddressOverview } from "@src/components/pages/address-overview/address-overview";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";

const AddressOverviewPage: React.FC<{ addressId: string }> = ({
  addressId,
}) => {
  const { formatMessage } = useIntl();
  const { data: address, error } = useSWR<Address, Error>(
    `/api/profile/addresses/${addressId}/`,
  );

  if (error) {
    throw error;
  }

  return (
    <Layout
      breadcrumbs={formatMessage({ id: "breadcrumb" })}
      title={formatMessage({ id: "title" })}
    >
      <AddressOverview address={address} />
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares(
    context,
    basicMiddlewares(getTracer(), logger),
    "account/profile/addresses/[id]/",
    () => {
      if (!context?.params?.id) {
        return {
          notFound: true,
        };
      }

      return {
        props: {
          addressId: context.params.id,
        },
      };
    },
  );
};

export { getServerSideProps };
export default AddressOverviewPage;
