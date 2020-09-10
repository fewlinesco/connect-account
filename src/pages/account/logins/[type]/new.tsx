import { GetServerSideProps } from "next";
import React from "react";

import { IdentityTypes } from "../../../../@types/Identity";
import { AddIdentityInputForm } from "../../../../components/display/fewlines/AddIdentityInputForm";
import { withSSRLogger } from "../../../../middleware/withSSRLogger";
import withSession from "../../../../middleware/withSession";

const AddNewIdentity: React.FC<{ type: IdentityTypes }> = (props) => {
  return <AddIdentityInputForm type={props.type} />;
};

export default AddNewIdentity;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  withSession(async (context) => {
    return {
      props: {
        type: context.params.type,
      },
    };
  }),
);
