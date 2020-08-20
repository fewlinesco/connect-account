import { GetServerSideProps } from "next";
import React from "react";

const NewIdentity: React.FC = () => {
  return <React.Fragment />;
};

export default NewIdentity;

export const getServerSideProps: GetServerSideProps = async (_context) => {
  return {
    props: {},
  };
};
