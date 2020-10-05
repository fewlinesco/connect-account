import { GetServerSideProps } from "next";
import React from "react";

import type { ReceivedIdentityTypes } from "@src/@types/Identity";
import { AddIdentity } from "@src/components/business/AddIdentity";
import { AddIdentityForm } from "@src/components/display/fewlines/AddIdentityForm/AddIdentityForm";
import { withSSRLogger } from "@src/middleware/withSSRLogger";
import withSession from "@src/middleware/withSession";

const AddIdentityPage: React.FC<{ type: ReceivedIdentityTypes }> = ({
  type,
}) => {
  return (
    <AddIdentity type={type}>
      {({ addIdentity }) => (
        <AddIdentityForm type={type} addIdentity={addIdentity} />
      )}
    </AddIdentity>
  );
};

export default AddIdentityPage;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  withSession(async (context) => {
    return {
      props: {
        type: context.params.type,
      },
    };
  }),
);
