import React from "react";
import { IdentityTypes } from "src/@types/Identity";
import styled from "styled-components";

type AddIdentityInputFormProps = {
  addIdentity: (value: string) => Promise<Response>;
  type: IdentityTypes;
};

export const AddIdentityInputForm: React.FC<AddIdentityInputFormProps> = ({
  addIdentity,
  type,
}) => {
  const [identity, setIdentity] = React.useState("");

  return (
    <Form
      data-testid="identity-form"
      method="post"
      onSubmit={() => addIdentity(identity)}
    >
      <Input
        type="text"
        name="value"
        placeholder={`Enter your ${type}`}
        value={identity}
        onChange={(event) => setIdentity(event.target.value)}
      />
      <SendInput type="submit" value="Send" />
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  border: ${({ theme }) => `${theme.colors.blacks[0]} ${theme.borders.thin}`};
  border-radius: ${({ theme }) => theme.radii[0]};
  padding: 0.5rem;

  &:active,
  &:focus {
    outline: none;
  }
`;

const SendInput = styled.input`
  color: ${({ theme }) => theme.colors.green};
  padding: 0.25em 1em;
`;
