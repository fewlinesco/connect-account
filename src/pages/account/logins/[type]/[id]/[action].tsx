import { GetServerSideProps } from "next";
import React from "react";

const IdentityAction: React.FC = () => {
  return <React.Fragment />;
};

export default IdentityAction;

export const getServerSideProps: GetServerSideProps = async (_context) => {
  return {
    props: {},
  };
};
