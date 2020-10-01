import React from "react";

import { AddIdentityInputForm } from "./AddIdentityInputForm";
import { ReceivedIdentityTypes } from "@src/@types/Identity";
import { AddIdentity } from "@src/components/business/AddIdentity";

export default {
  title: "pages/AddIdentityInputForm",
  component: AddIdentityInputForm,
};

export const StandardAddIdentityInputForm = (): JSX.Element => {
  return (
    <AddIdentity type={ReceivedIdentityTypes.EMAIL}>
      {({ addIdentity }) => (
        <AddIdentityInputForm
          type={ReceivedIdentityTypes.EMAIL}
          addIdentity={addIdentity}
        />
      )}
    </AddIdentity>
  );
};
