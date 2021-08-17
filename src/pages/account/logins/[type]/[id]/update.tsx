import { Identity, IdentityTypes } from "@fewlines/connect-management";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import { GetServerSideProps } from "next";
import React from "react";
import { useIntl } from "react-intl";
import useSWR from "swr";

import { UpdateIdentityForm } from "@src/components/forms/identities/update-identity-form";
import { Layout } from "@src/components/page-layout";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";
import { getIdentityType } from "@src/utils/get-identity-type";

const UpdateIdentityPage: React.FC<{ identityId: string }> = ({
  identityId,
}) => {
  const { formatMessage } = useIntl();
  const { data: identity, error } = useSWR<Identity, Error>(
    `/api/identities/${identityId}/`,
  );

  if (error) {
    throw error;
  }

  const breadcrumbs = identity
    ? getIdentityType(identity.type) === IdentityTypes.EMAIL
      ? formatMessage({ id: "emailBreadcrumb" })
      : formatMessage({ id: "phoneBreadcrumb" })
    : "";

  return (
    <Layout breadcrumbs={breadcrumbs} title={formatMessage({ id: "title" })}>
      <div className="container mb-40 lg:mb-0">
        <UpdateIdentityForm identity={identity} />
      </div>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares<{ identityId: string }>(
    context,
    basicMiddlewares(getTracer(), logger),
    "/account/logins/[type]/[id]/update/",
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
export default UpdateIdentityPage;
