import React from "react";

import { StoriesContainer } from "../StoriesContainer";
import { AddIdentityForm } from "./AddIdentityForm";
import { IdentityTypes } from "@lib/@types";
import { AddIdentity } from "@src/components/business/AddIdentity";

export default {
  title: "pages/Add Identity Form",
  component: AddIdentityForm,
};

export const AddEmailForm = (): JSX.Element => {
  return (
    <StoriesContainer>
      <AddIdentity type={IdentityTypes.EMAIL}>
        {({ addIdentity }) => (
          <AddIdentityForm
            type={IdentityTypes.EMAIL}
            addIdentity={addIdentity}
          />
        )}
      </AddIdentity>
    </StoriesContainer>
  );
};

export const AddPhoneForm = (): JSX.Element => {
  return (
    <StoriesContainer>
      <AddIdentity type={IdentityTypes.PHONE}>
        {({ addIdentity }) => (
          <AddIdentityForm
            type={IdentityTypes.PHONE}
            addIdentity={addIdentity}
          />
        )}
      </AddIdentity>
    </StoriesContainer>
  );
};
