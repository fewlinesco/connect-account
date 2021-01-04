import React from "react";

import { StoriesContainer } from "../StoriesContainer";
import { AddIdentityForm } from "./AddIdentityForm";
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
