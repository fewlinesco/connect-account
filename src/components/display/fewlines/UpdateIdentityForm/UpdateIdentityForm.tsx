import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { Form } from "../Form/Form";
import { Input } from "../Input/Input";
import { NeutralLink } from "../NeutralLink/NeutralLink";
import { Identity, IdentityTypes } from "@lib/@types";
import { Box } from "@src/components/display/fewlines/Box/Box";

export const UpdateIdentityForm: React.FC<{
  updateIdentity: (newValue: string) => Promise<void>;
  currentIdentity: Identity;
}> = ({ currentIdentity, updateIdentity }) => {
  const [identity, setIdentity] = React.useState("");
  const { value } = currentIdentity;

  return (
    <>
      <Box key={value}>
        <Value>{value}</Value>
      </Box>
      <Form
        onSubmit={async () => {
          updateIdentity(identity);
        }}
      >
        <p>
          New{" "}
          {currentIdentity.type === IdentityTypes.PHONE
            ? "phone number"
            : "email address"}{" "}
          *
        </p>
        <Input
          type="text"
          name="value"
          placeholder={`Enter your ${currentIdentity.type}`}
          value={identity}
          onChange={(event) => setIdentity(event.target.value)}
        />
        <Button variant={ButtonVariant.PRIMARY} type="submit">
          Update {currentIdentity.type}
        </Button>
      </Form>

      <NeutralLink href="/account/logins">
        <Button variant={ButtonVariant.SECONDARY}>Cancel</Button>
      </NeutralLink>
    </>
  );
};

const Value = styled.p`
  margin-right: 0.5rem;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;
