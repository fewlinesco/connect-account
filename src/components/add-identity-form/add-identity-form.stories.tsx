import React from "react";

import { StoriesContainer } from "../display/fewlines/StoriesContainer";
import { AddIdentityForm } from "./add-identity-form";
import { IdentityTypes } from "@lib/@types";

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
