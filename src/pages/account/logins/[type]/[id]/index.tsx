import { Identity, IdentityTypes } from "@fewlines/connect-management";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";
import { useIntl } from "react-intl";
import useSWR from "swr";

import { Layout } from "@src/components/page-layout";
import { IdentityOverview } from "@src/components/pages/identity-overview";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { SWRError } from "@src/errors/errors";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";
import { getIdentityType } from "@src/utils/get-identity-type";

const IdentityOverviewPage: React.FC<{
  identityId: string;
}> = ({ identityId }) => {
  const { formatMessage } = useIntl();

  const { data: identities, error } = useSWR<Identity[], SWRError>(
    "/api/identities/",
  );

  if (error) {
    throw error;
  }

  const currentIdentity = identities?.find(({ id }) => identityId === id);
  const breadcrumbs = currentIdentity
    ? getIdentityType(currentIdentity.type) === IdentityTypes.EMAIL
      ? formatMessage({ id: "emailBreadcrumb" })
      : formatMessage({ id: "phoneBreadcrumb" })
    : "";

  return (
    <Layout breadcrumbs={breadcrumbs} title={formatMessage({ id: "title" })}>
      <IdentityOverview identities={identities} />
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares<{ identityId: string }>(
    context,
    basicMiddlewares(getTracer(), logger),
    "/account/logins/[type]/[id]/",
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
