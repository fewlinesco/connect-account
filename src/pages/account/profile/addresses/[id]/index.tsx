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
import styled from "styled-components";
import useSWR from "swr";

import { Address } from "@src/@types/profile";
import { ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { Container } from "@src/components/containers/container";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { Layout } from "@src/components/page-layout";
import { configVariables } from "@src/configs/config-variables";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";

const AddressOverviewPage: React.FC<{ addressId: string }> = ({
  addressId,
}) => {
  const { error } = useSWR<{ address: Address }, Error>(
    `/api/profile/addresses/${addressId}`,
  );

  if (error) {
    throw error;
  }

  return (
    <Layout breadcrumbs={false} title="Personal information">
      <Container>
        <WIP>🏗</WIP>
        <NeutralLink href={`/account/profile/addresses/${addressId}/edit`}>
          <FakeButton variant={ButtonVariant.PRIMARY}>
            Update this address
          </FakeButton>
        </NeutralLink>
      </Container>
    </Layout>
  );
};

const WIP = styled.div`
  font-size: 20rem;
`;

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares(
    context,
    [
      tracingMiddleware(getTracer()),
      rateLimitingMiddleware(getTracer(), logger, {
        windowMs: 300000,
        requestsUntilBlock: 200,
      }),
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
