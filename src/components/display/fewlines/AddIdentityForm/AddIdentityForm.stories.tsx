import React from "react";

import { AddIdentityForm } from "./AddIdentityForm";
import { ReceivedIdentityTypes } from "@src/@types/Identity";
import { AddIdentity } from "@src/components/business/AddIdentity";

export default {
  title: "pages/AddIdentityForm",
  component: AddIdentityForm,
};

export const AddEmailForm = (): JSX.Element => {
  return (
    <AddIdentity type={ReceivedIdentityTypes.EMAIL}>
      {({ addIdentity }) => (
        <AddIdentityForm
          type={ReceivedIdentityTypes.EMAIL}
          addIdentity={addIdentity}
        />
      )}
    </AddIdentity>
  );
};

export const AddPhoneForm = (): JSX.Element => {
  return (
    <AddIdentity type={ReceivedIdentityTypes.PHONE}>
      {({ addIdentity }) => (
        <AddIdentityForm
          type={ReceivedIdentityTypes.PHONE}
          addIdentity={addIdentity}
        />
      )}
    </AddIdentity>
  );
};
