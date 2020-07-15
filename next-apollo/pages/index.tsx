import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";

import InputForm from "../src/components/InputForm";
import { IdentityTypes } from "../src/graphql/@types/Identity";
import { ProviderUser } from "../src/graphql/@types/ProviderUser";
import UserQuery from "../src/graphql/query/userQuery.graphql";
import { fetchManagement } from "../src/graphql/fetchManagement";

interface Index extends JSX.Element {
  fetchedData: { data: { provider: ProviderUser } };
}

const Index: React.FC<Index> = ({ fetchedData }) => {
  const [addEmail, setAddEmail] = React.useState<boolean>(false);
  const [addPhone, setAddPhone] = React.useState<boolean>(false);

  const { user } = fetchedData.data.provider;

  return (
    <>
      <Head>
        <title>Connect Account</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main style={{ margin: "0 auto" }}>
        <h1>Welcome to Connect Account</h1>
        {user.identities.map(({ value, type }) => {
          return type === IdentityTypes.EMAIL.toLowerCase() ? (<p>{value}</p>) : (<React.Fragment key={value} />)
        })}
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const operation = {
    query: UserQuery,
    variables: { userId: "5fab3a52-b242-4377-9e30-ae06589bebe6" },
  };

  const fetchedData = await fetchManagement(operation);

  return {
    props: {
      fetchedData,
    },
  };
};

export default Index;
