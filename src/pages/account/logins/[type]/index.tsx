import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";

const Today: React.FC = () => {
  const router = useRouter();

  console.log(router);

  return <React.Fragment />;
};

export default Today;

export const getServerSideProps: GetServerSideProps = async (_context) => {
  return {
    props: {},
  };
};
