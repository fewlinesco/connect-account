import React from "react";
import styled from "styled-components";

import { AddIdentityForm } from "./AddIdentityForm";
import { IdentityTypes } from "@lib/@types";
import { AddIdentity } from "@src/components/business/AddIdentity";
import { deviceBreakpoints } from "@src/design-system/theme/lightTheme";

export default {
  title: "pages/AddIdentityForm",
  component: AddIdentityForm,
};

export const AddEmailForm = (): JSX.Element => {
  return (
    <Wrapper>
      <AddIdentity type={IdentityTypes.EMAIL}>
        {({ addIdentity }) => (
          <AddIdentityForm
            type={IdentityTypes.EMAIL}
            addIdentity={addIdentity}
          />
        )}
      </AddIdentity>
    </Wrapper>
  );
};

export const AddPhoneForm = (): JSX.Element => {
  return (
    <Wrapper>
      <AddIdentity type={IdentityTypes.PHONE}>
        {({ addIdentity }) => (
          <AddIdentityForm
            type={IdentityTypes.PHONE}
            addIdentity={addIdentity}
          />
        )}
      </AddIdentity>
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
