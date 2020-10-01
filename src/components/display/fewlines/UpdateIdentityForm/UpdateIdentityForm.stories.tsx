import React from "react";

import { UpdateIdentityForm } from "./UpdateIdentityForm";
import { Identity, ReceivedIdentityTypes } from "@src/@types/Identity";
import { UpdateIdentity } from "@src/components/business/UpdateIdentity";

export default {
  title: "pages/UpdateIdentityForm",
  component: UpdateIdentityForm,
};

export const StandardUpdateIdentityForm = (): JSX.Element => {
  const mockedResponse: Identity = {
    id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
    primary: true,
    status: "validated",
    type: ReceivedIdentityTypes.EMAIL,
    value: "test@test.test",
  };

  return (
    <UpdateIdentity identity={mockedResponse}>
      {({ updateIdentity }) => (
        <UpdateIdentityForm
          updateIdentity={updateIdentity}
          currentIdentity={mockedResponse}
        />
      )}
    </UpdateIdentity>
  );
};
