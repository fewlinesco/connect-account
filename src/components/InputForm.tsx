import React from "react";
import styled from "styled-components";

import { IdentityTypes } from "../@types/Identity";

export const InputForm: React.FC<{ type: IdentityTypes }> = ({ type }) => {
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
            userId: "5fab3a52-b242-4377-9e30-ae06589bebe6",
            type,
            value: formValue,
          };

          fetch("/api/identity", {
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
