import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { InputText } from "../input/input-text";
import { Form } from "./form";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";

const VerifyTwoFACodeForm: React.FC = () => {
  const [formID, setFormID] = React.useState<string>(uuidv4());
  const [verificationCode, setVerificationCode] = React.useState<string>("");

  return (
    <ExtendedStyledForm
      formID={formID}
      onSubmit={async () => {
        setFormID(uuidv4());
        return;
      }}
    >
      <InputText
        type="text"
        name="verificationCode"
        onChange={(value) => setVerificationCode(value)}
        value={verificationCode}
        label="Enter received code here:"
        maxLength={6}
      />

      <Button variant={ButtonVariant.PRIMARY} type="submit">
        Confirm
      </Button>
    </ExtendedStyledForm>
  );
};

const ExtendedStyledForm = styled(Form)`
  padding: ${({ theme }) => theme.spaces.xs} 0 0 0;

  p {
    padding-bottom: ${({ theme }) => theme.spaces.xs};
    padding-left: ${({ theme }) => theme.spaces.xs};
  }

  button {
    margin-bottom: 0;
  }
`;

export { VerifyTwoFACodeForm };