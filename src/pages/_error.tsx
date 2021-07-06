import type { NextPageContext } from "next";
import NextError, { ErrorProps as NextErrorProps } from "next/error";
import React from "react";

import { ErrorFallbackComponent } from "@src/components/error-fallback-component/error-fallback-component";
import { Layout } from "@src/components/page-layout";

type CustomErrorComponentProps = {
  error: Error;
  statusCode: number;
  isReadyToRender: boolean;
  children?: React.ReactElement;
};

type ErrorProps = {
  isReadyToRender: boolean;
} & NextErrorProps;

const CustomErrorComponent = (
  props: CustomErrorComponentProps,
): JSX.Element => {
  return (
    <Layout breadcrumbs={false}>
      <ErrorFallbackComponent statusCode={props.statusCode} />
    </Layout>
  );
};

CustomErrorComponent.getInitialProps = async (
  props: NextPageContext,
): Promise<ErrorProps> => {
  const { res: response, err: error } = props;

  const errorInitialProps: ErrorProps = (await NextError.getInitialProps({
    res: response,
    err: error,
  } as NextPageContext)) as ErrorProps;
  // Workaround for https://github.com/vercel/next.js/issues/8592.
  errorInitialProps.isReadyToRender = true;

  if (response) {
    if (response.statusCode === 404) {
      return { statusCode: 404, isReadyToRender: true };
    }

    if (error) {
      return errorInitialProps;
    }
  }

  return errorInitialProps;
};

export default CustomErrorComponent;
