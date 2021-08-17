import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";
import { useIntl } from "react-intl";
import useSWR from "swr";

import { SetPasswordForm } from "@src/components/forms/set-password-form";
import { Layout } from "@src/components/page-layout";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";
import { verifySudoModeMiddleware } from "@src/middlewares/verify-sudo-mode-middleware";

const SecurityUpdatePage: React.FC = () => {
  const { data: isPasswordSetData, error: isPasswordSetError } = useSWR<
    { isPasswordSet: boolean },
    Error
  >("/api/auth-connect/is-password-set/");

  if (isPasswordSetError) {
    throw isPasswordSetError;
  }

  const { formatMessage } = useIntl();
  let conditionalBreadcrumb;

  if (!isPasswordSetData) {
    conditionalBreadcrumb = "";
  } else {
    conditionalBreadcrumb = isPasswordSetData.isPasswordSet
      ? formatMessage({ id: "updateBreadcrumb" })
      : formatMessage({ id: "setBreadcrumb" });
  }

  return (
    <Layout
      breadcrumbs={conditionalBreadcrumb}
      title={formatMessage({ id: "title" })}
    >
      <div className="container mb-40 lg:mb-0">
        <SetPasswordForm
          submitButtonLabel={
            !isPasswordSetData
              ? ""
              : isPasswordSetData.isPasswordSet
              ? formatMessage({ id: "update" })
              : formatMessage({ id: "set" })
          }
        />
      </div>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares(
    context,
    [
      ...basicMiddlewares(getTracer(), logger),
      verifySudoModeMiddleware(getTracer(), context.resolvedUrl),
    ],
    "/account/security/update/",
  );
};

export { getServerSideProps };
export default SecurityUpdatePage;
