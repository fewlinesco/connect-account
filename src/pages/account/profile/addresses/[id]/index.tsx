import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
  rateLimitingMiddleware,
} from "@fwl/web/dist/middlewares";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";
import useSWR from "swr";

import { Address } from "@src/@types/profile";
import { Container } from "@src/components/containers/container";
import { Layout } from "@src/components/page-layout";
import { AddressOverview } from "@src/components/pages/address-overview/address-overview";
import { configVariables } from "@src/configs/config-variables";
import { logger } from "@src/configs/logger";
import rateLimitingConfig from "@src/configs/rate-limiting-config";
import getTracer from "@src/configs/tracer";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";

const AddressOverviewPage: React.FC<{ addressId: string }> = ({
  addressId,
}) => {
  const { data: address, error } = useSWR<Address, Error>(
    `/api/profile/addresses/${addressId}`,
  );

  if (error) {
    throw error;
  }

  return (
    <Layout breadcrumbs="Address" title="Personal information">
      <Container>
        <AddressOverview address={address} />
      </Container>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares(
    context,
    [
      tracingMiddleware(getTracer()),
      rateLimitingMiddleware(getTracer(), logger, rateLimitingConfig),
      recoveryMiddleware(getTracer()),
      sentryMiddleware(getTracer()),
      errorMiddleware(getTracer()),
      loggingMiddleware(getTracer(), logger),
      authMiddleware(getTracer()),
    ],
    "account/profile/addresses/[id]",
    () => {
      if (!configVariables.featureFlag) {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }

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
