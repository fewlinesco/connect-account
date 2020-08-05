import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import styled from "styled-components";

type IndexProps = {
  authParams: {
    [key: string]: string;
    providerURL: string;
    clientID: string;
    clientSecret: string;
    redirectURI: string;
    scope: string;
  };
};

const Index: React.FC<IndexProps> = ({ authParams }) => {
  const { providerURL, ...queryStringsParams } = authParams;

  const searchParams = new URLSearchParams();

  Object.entries(queryStringsParams).forEach(([key, value]) =>
    searchParams.append(key, value),
  );

  return (
    <>
      <Head>
        <title>Connect Account</title>
      </Head>
      <Main>
        <LoginButton>
          <a
            href={`${providerURL}/oauth/authorize?${searchParams.toString()}&response_type=code`}
          >
            Login
          </a>
        </LoginButton>
      </Main>
    </>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async () => {
  const authParams = {
    providerURL: process.env.PROVIDER_URL,
    client_id: process.env.API_CLIENT_ID,
    redirect_uri: process.env.API_REDIRECT_URI,
    scope: process.env.API_SCOPES,
  };

  return {
    props: {
      authParams,
    },
  };
};

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
