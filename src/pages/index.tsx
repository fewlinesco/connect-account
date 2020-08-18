import Head from "next/head";
import React from "react";
import styled from "styled-components";
import useSWR from "swr";

import { SWRFetcher } from "../utils/SWRFetcher";

const Index: React.FC = () => {
  const { data, error } = useSWR<{ authorizeURL: string }, Error>(
    "/api/oauth/params",
    (url) => SWRFetcher<{ authorizeURL: string }>(url),
  );

  if (error) {
    return <div>Failed to load</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Connect Account</title>
      </Head>
      <Main>
        <LoginButton>
          <a href={data.authorizeURL.toString()}>Login</a>
        </LoginButton>
      </Main>
    </>
  );
};

export default Index;

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
