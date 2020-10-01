import React from "react";

import IdentityValidationForm from "./IdentityValidationForm";
import { IdentityTypes } from "@lib/@types/Identity";
import { VerifyIdentity } from "@src/components/business/VerifyIdentity";

export default {
  title: "pages/IdentityValidationForm",
  component: IdentityValidationForm,
};

export const StandardIdentityValidationForm = (): JSX.Element => {
  return (
    <VerifyIdentity eventId={"1234"}>
      {({ verifyIdentity }) => (
        <IdentityValidationForm
          type={IdentityTypes.EMAIL}
          verifyIdentity={verifyIdentity}
        />
      )}
    </VerifyIdentity>
  );
};
