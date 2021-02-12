import { IdentityTypes } from "@fewlines/connect-management";
import React from "react";

import { AddIdentityForm } from "./add-identity-form";
import { StoriesContainer } from "@src/components/containers/stories-container";

const AddEmailForm = (): JSX.Element => {
  return (
    <StoriesContainer>
      <AddIdentityForm type={IdentityTypes.EMAIL} />
    </StoriesContainer>
  );
};

const AddPhoneForm = (): JSX.Element => {
  return (
    <StoriesContainer>
      <AddIdentityForm type={IdentityTypes.PHONE} />
    </StoriesContainer>
  );
};

export { AddEmailForm, AddPhoneForm };
export default {
  title: "pages/Add Identity Form",
  component: AddIdentityForm,
};
