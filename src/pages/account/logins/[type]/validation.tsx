import { GetServerSideProps } from "next";
import React from "react";
import { withSSRLogger } from "src/middleware/withSSRLogger";
import withSession from "src/middleware/withSession";

import { IdentityTypes } from "../../../../@types/Identity";
import IdentityValidationForm from "../../../../components/display/fewlines/IdentityValidationForm";

const Validation: React.FC<{ type: IdentityTypes }> = ({ type }) => {
  return <IdentityValidationForm type={type} />;
};

export default Validation;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  withSession(async (context) => {
    return {
      props: {
        type: context.params.type,
      },
    };
  }),
);
