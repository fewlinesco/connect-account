import React from "react";

import { AddIdentityForm } from "./add-identity-form";
import { IdentityTypes } from "@lib/@types";
import { StoriesContainer } from "@src/components/containers/stories-container";

export default {
  title: "pages/Add Identity Form",
  component: AddIdentityForm,
};

export const AddEmailForm = (): JSX.Element => {
  return (
    <StoriesContainer>
      <AddIdentityForm type={IdentityTypes.EMAIL} />
    </StoriesContainer>
  );
};

export const AddPhoneForm = (): JSX.Element => {
  return (
    <StoriesContainer>
      <AddIdentityForm type={IdentityTypes.PHONE} />
    </StoriesContainer>
  );
};
