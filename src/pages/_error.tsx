import * as Sentry from "@sentry/node";
import { NextPageContext } from "next";
import NextError, { ErrorProps as NextErrorProps } from "next/error";
import React from "react";
import styled from "styled-components";

type ErrorPageProps = {
  error: Error;
  statusCode: number;
  isReadyToRender: boolean;
  children?: React.ReactElement;
};

export type ErrorProps = {
  isReadyToRender: boolean;
} & NextErrorProps;

const ErrorPage = (props: ErrorPageProps): JSX.Element => {
  const { isReadyToRender, error } = props;

  if (!isReadyToRender && error) {
    // getInitialProps is not called for top-level errors - See https://github.com/vercel/next.js/issues/8592.
    Sentry.captureException(error);
  }

  return (
    <Wrapper>
      <h2>
        Something went wrong. We are working on getting this fixed as soon as we
        can.
      </h2>
    </Wrapper>
  );
};

ErrorPage.getInitialProps = async (
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

export default ErrorPage;

const Wrapper = styled.div`
  width: 100rem;
  min-height: 15rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }) => theme.radii[1]};
  background-color: ${({ theme }) => theme.colors.backgroundContrast};
  box-shadow: ${({ theme }) => theme.shadows.base};

  p {
    font-size: ${({ theme }) => theme.fontSizes.l};
  }
`;
