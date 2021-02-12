import { IdentityTypes } from "@fewlines/connect-management";
import React from "react";

import { StoriesContainer } from "../containers/stories-container";
import { ValidateIdentityForm } from "./validate-identity-form";

const ValidateEmailForm = (): JSX.Element => {
  return (
    <StoriesContainer>
      <ValidateIdentityForm type={IdentityTypes.EMAIL} eventId={"1234"} />
    </StoriesContainer>
  );
};

const ValidatePhoneForm = (): JSX.Element => {
  return (
    <StoriesContainer>
      <ValidateIdentityForm type={IdentityTypes.PHONE} eventId={"1234"} />
    </StoriesContainer>
  );
};

export { ValidateEmailForm, ValidatePhoneForm };
export default {
  title: "pages/Validate Identity Form",
  component: ValidateIdentityForm,
};
