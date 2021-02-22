import { Identity, IdentityTypes } from "@fewlines/connect-management";
import React from "react";

import { StoriesContainer } from "../containers/stories-container";
import { UpdateIdentityForm } from "./update-identity-form";

const UpdateEmailForm = (): JSX.Element => {
  const emailIdentity: Identity = {
    id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
    primary: true,
    status: "validated",
    type: IdentityTypes.EMAIL,
    value: "test@test.test",
  };

  return (
    <StoriesContainer>
      <UpdateIdentityForm currentIdentity={emailIdentity} />
    </StoriesContainer>
  );
};

const UpdatePhoneForm = (): JSX.Element => {
  const phoneIdentity: Identity = {
    id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
    primary: true,
    status: "validated",
    type: IdentityTypes.PHONE,
    value: "0622116655",
  };

  return (
    <StoriesContainer>
      <UpdateIdentityForm currentIdentity={phoneIdentity} />
    </StoriesContainer>
  );
};

export { UpdateEmailForm, UpdatePhoneForm };
export default {
  title: "pages/Update Identity Form",
  component: UpdateIdentityForm,
};
