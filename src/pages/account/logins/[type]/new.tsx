import { GetServerSideProps } from "next";
import React from "react";

import type { ReceivedIdentityTypes } from "@src/@types/Identity";
import { AddIdentity } from "@src/components/business/AddIdentity";
import { AddIdentityInputForm } from "@src/components/display/fewlines/AddIdentityInputForm";
import { withSSRLogger } from "@src/middleware/withSSRLogger";
import withSession from "@src/middleware/withSession";

const AddNewIdentity: React.FC<{ type: ReceivedIdentityTypes }> = ({
  type,
}) => {
  return (
    <AddIdentity type={type}>
      {({ addIdentity }) => (
        <AddIdentityInputForm type={type} addIdentity={addIdentity} />
      )}
    </AddIdentity>
  );
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
