import { IdentityTypes } from "@fewlines/connect-management";
import React from "react";

import { StoriesContainer } from "../containers/stories-container";
import { ValidateIdentityForm } from "./validate-identity-form";

export default {
  title: "pages/Validate Identity Form",
  component: ValidateIdentityForm,
};

export const ValidateEmailForm = (): JSX.Element => {
  return (
    <StoriesContainer>
      <ValidateIdentityForm type={IdentityTypes.EMAIL} eventId={"1234"} />
    </StoriesContainer>
  );
};

export const ValidatePhoneForm = (): JSX.Element => {
  return (
    <StoriesContainer>
      <ValidateIdentityForm type={IdentityTypes.PHONE} eventId={"1234"} />
    </StoriesContainer>
  );
};
