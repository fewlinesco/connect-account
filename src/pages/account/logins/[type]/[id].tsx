import { GetServerSideProps } from "next";
import React from "react";

const ShowIdentity: React.FC = () => {
  return <React.Fragment />;
};

export default ShowIdentity;

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log(context);

  return {
    props: {},
  };
};
