import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";

import InputForm from "../src/components/InputForm";
import { IdentityTypes } from "../src/graphql/@types/Identities";
import { initializeApollo } from "../src/graphql/apolloClientConfig";
import UserQuery from "../src/graphql/query/userQuery.graphql";

interface Index extends JSX.Element {
  userEmail?: string;
  userPhone?: string;
}

const Index: React.FC<Index> = ({ userEmail, userPhone }) => {
  const [addEmail, setAddEmail] = React.useState<boolean>(false);
  const [addPhone, setAddPhone] = React.useState<boolean>(false);

  return (
    <>
      <Head>
        <title>Connect Account</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main style={{ margin: "0 auto" }}>
        <h1>Welcome to Connect Account</h1>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={{ marginRight: "50px" }}>
            Your email is <strong>{userEmail}</strong>
          </p>
          <button
            onClick={() => {
              const requestData = {
                userId: "5fab3a52-b242-4377-9e30-ae06589bebe6",
                type: IdentityTypes.EMAIL,
                value: userEmail,
              };

              fetch("/api/identity", {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
              });
            }}
          >
            Remove this email
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={() => {
              setAddEmail(!addEmail);
            }}
            style={{ marginRight: "50px" }}
          >
            Add an email
          </button>
          {addEmail && (
            <InputForm apiUrl="/api/identity" type={IdentityTypes.EMAIL} />
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={{ marginRight: "50px" }}>
            Your phone number is <strong>{userPhone}</strong>
          </p>
          <button
            onClick={() => {
              const requestData = {
                userId: "5fab3a52-b242-4377-9e30-ae06589bebe6",
                type: IdentityTypes.PHONE,
                value: userPhone,
              };

              fetch("/api/identity", {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
              });
            }}
          >
            Remove this email
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={() => {
              setAddPhone(!addEmail);
            }}
            style={{ marginRight: "50px" }}
          >
            Add an email
          </button>
          {addPhone && (
            <InputForm apiUrl="/api/identity" type={IdentityTypes.PHONE} />
          )}
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: UserQuery,
    variables: { userId: "5fab3a52-b242-4377-9e30-ae06589bebe6" },
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

export default Index;
