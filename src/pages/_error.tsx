import * as Sentry from "@sentry/node";
import type { NextPageContext } from "next";
import NextError, { ErrorProps as NextErrorProps } from "next/error";
import React from "react";

import { ErrorFallbackComponent } from "@src/components/error-fallback-component/error-fallback-component";
import { Layout } from "@src/components/layout-remove";

type CustomErrorComponentProps = {
  error: Error;
  statusCode: number;
  isReadyToRender: boolean;
  children?: React.ReactElement;
};

export type ErrorProps = {
  isReadyToRender: boolean;
} & NextErrorProps;

const CustomErrorComponent = (
  props: CustomErrorComponentProps,
): JSX.Element => {
  const { isReadyToRender, error, statusCode } = props;

  if (!isReadyToRender && error) {
    // getInitialProps is not called for top-level errors - See https://github.com/vercel/next.js/issues/8592.
    Sentry.captureException(error);
  }

  return (
    <Layout>
      <ErrorFallbackComponent statusCode={statusCode} />
    </Layout>
  );
};

CustomErrorComponent.getInitialProps = async (
  props: NextPageContext,
): Promise<ErrorProps> => {
  const { res, err, asPath } = props;

  const errorInitialProps: ErrorProps = (await NextError.getInitialProps({
    res,
    err,
  } as NextPageContext)) as ErrorProps;

  // Workaround for https://github.com/vercel/next.js/issues/8592.
  errorInitialProps.isReadyToRender = true;

  if (res) {
    if (res.statusCode === 404) {
      return { statusCode: 404, isReadyToRender: true };
    }

    if (err) {
      Sentry.captureException(err);

      return errorInitialProps;
    }
  } else {
    if (err) {
      Sentry.captureException(err);

      return errorInitialProps;
    }
  }

  // If this point is reached, getInitialProps was called without any
  // information about what the error might be. This is unexpected and may
  // indicate a bug introduced in Next.js, so record it in Sentry
  Sentry.captureException(
    new Error(`_error.js getInitialProps missing data at path: ${asPath}`),
  );

  return errorInitialProps;
};

export default CustomErrorComponent;
