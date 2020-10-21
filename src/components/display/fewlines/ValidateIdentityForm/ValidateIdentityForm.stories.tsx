import React from "react";

import { StoriesContainer } from "../StoriesContainer";
import ValidateIdentityForm from "./ValidateIdentityForm";
import { IdentityTypes } from "@lib/@types/Identity";
import { ValidateIdentity } from "@src/components/business/ValidateIdentity";

export default {
  title: "pages/ValidateIdentityForm",
  component: ValidateIdentityForm,
};

export const ValidateEmailForm = (): JSX.Element => {
  return (
    <StoriesContainer>
      <ValidateIdentity eventId={"1234"}>
        {({ validateIdentity }) => (
          <ValidateIdentityForm
            type={IdentityTypes.EMAIL}
            validateIdentity={validateIdentity}
          />
        )}
      </ValidateIdentity>
    </StoriesContainer>
  );
};

export const ValidatePhoneForm = (): JSX.Element => {
  return (
    <StoriesContainer>
      <ValidateIdentity eventId={"1234"}>
        {({ validateIdentity }) => (
          <ValidateIdentityForm
            type={IdentityTypes.PHONE}
            validateIdentity={validateIdentity}
          />
        )}
      </ValidateIdentity>
    </StoriesContainer>
  );
};
