import { IdentityTypes } from "@fewlines/connect-management";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import { GetServerSideProps } from "next";
import React from "react";
import { useIntl } from "react-intl";

import { AddIdentityForm } from "@src/components/forms/identities/add-identity-form";
import { Layout } from "@src/components/page-layout";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";
import { getIdentityType } from "@src/utils/get-identity-type";

const AddIdentityPage: React.FC<{ type: IdentityTypes }> = ({ type }) => {
  const { formatMessage } = useIntl();

  return (
    <Layout
      breadcrumbs={
        getIdentityType(type) === IdentityTypes.EMAIL
          ? formatMessage({ id: "emailBreadcrumb" })
          : formatMessage({ id: "phoneBreadcrumb" })
      }
      title={formatMessage({ id: "title" })}
    >
      <div className="container mb-40 lg:mb-0">
        <AddIdentityForm type={type} />
      </div>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares<{ type: string }>(
    context,
    basicMiddlewares(getTracer(), logger),
    "/account/logins/[type]/new",
    () => {
      if (!context?.params?.type) {
        return {
          notFound: true,
        };
      }

      if (!["email", "phone"].includes(context.params.type.toString())) {
        return {
          notFound: true,
        };
      }

      return {
        props: {
          type: context.params.type.toString(),
        },
      };
    },
  );
};

export { getServerSideProps };
export default AddIdentityPage;
