import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import { handleOauthParamsURL } from "src/utils/handleOauthParamsURL";
import styled from "styled-components";

import { withSSRLogger } from "../middleware/withSSRLogger";
import Sentry, { addRequestScopeToSentry } from "../utils/sentry";

type IndexProps = { authorizeURL: string };

const Index: React.FC<IndexProps> = ({ authorizeURL }) => {
  return (
    <>
      <Head>
        <title>Connect Account</title>
      </Head>
      <Main>
        <LoginButton>
          <a href={authorizeURL}>Login</a>
        </LoginButton>
      </Main>
    </>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  async (context) => {
    addRequestScopeToSentry(context.req);

    try {
      const authorizeURL = await handleOauthParamsURL(context);

      return {
        props: {
          authorizeURL: authorizeURL.toString(),
        },
      };
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setTag("/pages/index SSR", "/pages/index SSR");
        Sentry.captureException(error);
      });
    }

    return { props: {} };
  },
);

const Main = styled.main`
  width: 100%;
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginButton = styled.div`
  padding: 0.5rem 2rem;
  border-radius: ${({ theme }) => theme.radii[0]};
  background-color: transparent;
  border: ${({ theme }) => `${theme.colors.green} ${theme.borders.thin}`};
  transition: ${({ theme }) => theme.transitions.quick};
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  a {
    color: ${({ theme }) => theme.colors.green};
    text-decoration: none;
  }

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.green};

    a {
      color: ${({ theme }) => theme.colors.contrastCopy};
    }
  }

  &:active,
  &:focus {
    outline: none;
    ${(props) => `background-color: ${props.color}`};
    color: ${({ theme }) => theme.colors.contrastCopy};
  }
`;
