import { GetServerSideProps } from "next";
import React from "react";

const LoginsAction: React.FC = () => {
  return <React.Fragment />;
};

export default LoginsAction;

export const getServerSideProps: GetServerSideProps = async (_context) => {
  return {
    props: {},
  };
};
