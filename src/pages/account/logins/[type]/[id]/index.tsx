import { Identity, IdentityTypes } from "@fewlines/connect-management";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";
import useSWR from "swr";

import { Container } from "@src/components/containers/container";
import { Layout } from "@src/components/page-layout";
import { IdentityOverview } from "@src/components/pages/identity-overview/identity-overview";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { SWRError } from "@src/errors/errors";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";
import { getIdentityType } from "@src/utils/get-identity-type";

const IdentityOverviewPage: React.FC<{
  identityId: string;
}> = ({ identityId }) => {
  const { data: identity, error } = useSWR<Identity, SWRError>(
    `/api/identities/${identityId}`,
  );

  if (error) {
    throw error;
  }

  const breadcrumbs = identity
    ? getIdentityType(identity.type) === IdentityTypes.EMAIL
      ? "Email address"
      : "Phone number"
    : "";

  return (
    <Layout breadcrumbs={breadcrumbs} title="Logins">
      <Container>
        <IdentityOverview identity={identity} />
      </Container>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares<{ identityId: string }>(
    context,
    basicMiddlewares(getTracer(), logger),
    "/account/logins/[type]/[id]",
    () => {
      if (!context?.params?.id) {
        return {
          notFound: true,
        };
      }

      return {
        props: {
          identityId: context.params.id,
        },
      };
    },
  );
};

export { getServerSideProps };
export default IdentityOverviewPage;
