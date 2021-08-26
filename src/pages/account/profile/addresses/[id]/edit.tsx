import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";
import { useIntl } from "react-intl";
import useSWR from "swr";

import { Address } from "@src/@types/profile";
import { UserAddressForm } from "@src/components/forms/profile/user-address-form";
import { Layout } from "@src/components/page-layout";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { SWRError } from "@src/errors/errors";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";

const EditAddressPage: React.FC<{ addressId: string }> = ({ addressId }) => {
  const { formatMessage } = useIntl();
  const { data: address, error } = useSWR<Address, SWRError>(
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
      <UserAddressForm
        userAddress={address ? address : undefined}
        isCreation={false}
      />
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares(
    context,
    basicMiddlewares(getTracer(), logger),
    "/account/profile/address/[id]/edit/",
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
export default EditAddressPage;
