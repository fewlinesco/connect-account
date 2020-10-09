import React from "react";

import { AddIdentityForm } from "./AddIdentityForm";
import { IdentityTypes } from "@lib/@types";
import { AddIdentity } from "@src/components/business/AddIdentity";

export default {
  title: "pages/AddIdentityForm",
  component: AddIdentityForm,
};

export const AddEmailForm = (): JSX.Element => {
  return (
    <AddIdentity type={IdentityTypes.EMAIL}>
      {({ addIdentity }) => (
        <AddIdentityForm type={IdentityTypes.EMAIL} addIdentity={addIdentity} />
      )}
    </AddIdentity>
  );
};

export const AddPhoneForm = (): JSX.Element => {
  return (
    <AddIdentity type={IdentityTypes.PHONE}>
      {({ addIdentity }) => (
        <AddIdentityForm type={IdentityTypes.PHONE} addIdentity={addIdentity} />
      )}
    </AddIdentity>
  );
};
