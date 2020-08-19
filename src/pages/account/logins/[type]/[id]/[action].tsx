import { GetServerSideProps } from "next";
import React from "react";

const Today: React.FC = () => {
  return <React.Fragment />;
};

export default Today;

export const getServerSideProps: GetServerSideProps = async (_context) => {
  return {
    props: {},
  };
};
