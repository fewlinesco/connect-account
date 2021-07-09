import type { NextPageContext } from "next";
import React from "react";

import { ErrorFallbackComponent } from "@src/components/error-fallback-component/error-fallback-component";
import { Layout } from "@src/components/page-layout";

const CustomErrorComponent = ({
  statusCode,
}: {
  statusCode: number;
}): JSX.Element => {
  return (
    <Layout breadcrumbs={false}>
      <ErrorFallbackComponent statusCode={statusCode} />
    </Layout>
  );
};

CustomErrorComponent.getInitialProps = (props: NextPageContext) => {
  const { res, err } = props;
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

  return { statusCode };
};

export default CustomErrorComponent;
