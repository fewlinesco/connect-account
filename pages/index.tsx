import gql from "graphql-tag";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";

import { initializeApollo } from "../src/graphql/apolloClientConfig";

interface IndexPage extends JSX.Element {
  userEmail?: string;
  userPhone?: string;
}

const IndexPage: React.FC<IndexPage> = ({ userEmail, userPhone }) => {
  return (
    <>
      <Head>
        <title>Connect Account</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main>
        <div>
          <h1>Welcome to Connect Account</h1>
          <p>Your email is {userEmail}</p>
          <p>Your phone number is {userPhone}</p>
        </div>
      </main>
    </>
  );
};

const USER_QUERY = gql`
  query($userId: String!) {
    provider {
      id
      name
      user(filters: { userId: $userId }) {
        id
        identities {
          type
          value
          primary
          status
        }
      }
    }
  }
`;

export const getServerSideProps: GetServerSideProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: USER_QUERY,
    variables: { userId: "5b5fe222-3070-4169-8f24-51b587b2dbc5" },
  });

  const initialApolloState = apolloClient.cache.extract();

  return {
    props: {
      initialApolloState,
      userEmail: initialApolloState.userEmail?.value,
      userPhone: initialApolloState.userPhone?.value,
    },
  };
};

export default IndexPage;
