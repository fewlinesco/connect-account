import React from "react";
import styled from "styled-components";

import { UpdateIdentityForm } from "./UpdateIdentityForm";
import { Identity, IdentityTypes } from "@lib/@types";
import { UpdateIdentity } from "@src/components/business/UpdateIdentity";
import { deviceBreakpoints } from "@src/design-system/theme/lightTheme";

export default {
  title: "pages/UpdateIdentityForm",
  component: UpdateIdentityForm,
};

export const UpdateEmailForm = (): JSX.Element => {
  const mockedResponse: Identity = {
    id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
    primary: true,
    status: "validated",
    type: IdentityTypes.EMAIL,
    value: "test@test.test",
  };

  return (
    <Wrapper>
      <UpdateIdentity identity={mockedResponse}>
        {({ updateIdentity }) => (
          <UpdateIdentityForm
            updateIdentity={updateIdentity}
            currentIdentity={mockedResponse}
          />
        )}
      </UpdateIdentity>
    </Wrapper>
  );
};

export const UpdatePhoneForm = (): JSX.Element => {
  const mockedResponse: Identity = {
    id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
    primary: true,
    status: "validated",
    type: IdentityTypes.PHONE,
    value: "0677112244",
  };

  return (
    <Wrapper>
      <UpdateIdentity identity={mockedResponse}>
        {({ updateIdentity }) => (
          <UpdateIdentityForm
            updateIdentity={updateIdentity}
            currentIdentity={mockedResponse}
          />
        )}
      </UpdateIdentity>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 60%;
  margin: 0 auto;

  @media ${deviceBreakpoints.m} {
    width: 90%;
  }
`;
