import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../buttons/buttons";
import { FakeButton } from "../fake-button/fake-button";
import { Form } from "../form/form";
import { Input } from "../input/input";
import { NeutralLink } from "../neutral-link/neutral-link";
import { Identity, IdentityTypes } from "@lib/@types";
import { Box } from "@src/components/box/box";

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
        <FakeButton variant={ButtonVariant.SECONDARY}>Cancel</FakeButton>
      </NeutralLink>
    </>
  );
};

const Value = styled.p`
  margin-right: 0.5rem;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;
