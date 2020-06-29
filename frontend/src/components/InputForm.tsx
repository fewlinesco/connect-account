import React from "react";
import { IdentityTypes } from "../@types/Identities";
import styled from "styled-components";

type InputForm = {
  apiUrl: RequestInfo;
  type: IdentityTypes;
};

export const InputForm: React.FC<InputForm> = ({ apiUrl, type }) => {
  const [formValue, setFormValue] = React.useState("");

  return (
    <Form>
      <Input
        type="text"
        name="value"
        placeholder="Enter your email"
        value={formValue}
        onChange={(event) => setFormValue(event.target.value)}
      />
      <SendInput
        type="submit"
        value="Send"
        onClick={() => {
          const body = {
            userId: "5b5fe222-3070-4169-8f24-51b587b2dbc5",
            type,
            value: formValue,
          };

          fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
        }}
      />
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
