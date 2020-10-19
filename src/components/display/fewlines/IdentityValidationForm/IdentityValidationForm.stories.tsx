import React from "react";
import styled from "styled-components";

import IdentityValidationForm from "./IdentityValidationForm";
import { IdentityTypes } from "@lib/@types/Identity";
import { VerifyIdentity } from "@src/components/business/VerifyIdentity";
import { deviceBreakpoints } from "@src/design-system/theme/lightTheme";

export default {
  title: "pages/IdentityValidationForm",
  component: IdentityValidationForm,
};

export const EmailValidationForm = (): JSX.Element => {
  return (
    <Wrapper>
      <VerifyIdentity eventId={"1234"}>
        {({ verifyIdentity }) => (
          <IdentityValidationForm
            type={IdentityTypes.EMAIL}
            verifyIdentity={verifyIdentity}
          />
        )}
      </VerifyIdentity>
    </Wrapper>
  );
};

export const PhoneValidationForm = (): JSX.Element => {
  return (
    <Wrapper>
      <VerifyIdentity eventId={"1234"}>
        {({ verifyIdentity }) => (
          <IdentityValidationForm
            type={IdentityTypes.PHONE}
            verifyIdentity={verifyIdentity}
          />
        )}
      </VerifyIdentity>
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
