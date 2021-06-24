import { Identity, IdentityTypes } from "@fewlines/connect-management";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import { GetServerSideProps } from "next";
import React from "react";
import useSWR from "swr";

import { Container } from "@src/components/containers/container";
import { UpdateIdentityForm } from "@src/components/forms/identities/update-identity-form";
import { Layout } from "@src/components/page-layout";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";

const UpdateIdentityPage: React.FC<{ identityId: string }> = ({
  identityId,
}) => {
  const { data: identity, error } = useSWR<Identity, Error>(
    `/api/identities/${identityId}`,
  );

  if (error) {
    throw error;
  }

  const breadcrumbs = identity
    ? identity.type.toUpperCase() === IdentityTypes.EMAIL
      ? "Email address | edit"
      : "Phone number | edit"
    : "";

  return (
    <Layout breadcrumbs={breadcrumbs} title="Logins">
      <Container>
        <UpdateIdentityForm identity={identity} />
      </Container>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares<{ identityId: string }>(
    context,
    basicMiddlewares(getTracer(), logger),
    "/account/logins/[type]/[id]/update",
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
