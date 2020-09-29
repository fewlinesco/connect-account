import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "./Button/Button";
import { Input } from "./Input/Input";
import { NavigationBreadcrumbs } from "./NavigationBreadcrumbs/NavigationBreadcrumbs";
import { IdentityTypes } from "@lib/@types/Identity";
import { Identity, ReceivedIdentityTypes } from "@src/@types/Identity";
import { Box } from "@src/components/display/fewlines/Box/Box";

export const UpdateIdentityForm: React.FC<{
  updateIdentity: (newValue: string) => Promise<void>;
  currentIdentity: Identity;
}> = ({ currentIdentity, updateIdentity }) => {
  const [identity, setIdentity] = React.useState("");
  const router = useRouter();
  const { value } = currentIdentity;

  return (
    <Wrapper>
      <NavigationBreadcrumbs
        title="Logins"
        breadcrumbs={`${
          currentIdentity.type === IdentityTypes.EMAIL.toLowerCase()
            ? "Email address"
            : "Phone number"
        } | edit`}
      />
      <Box key={value}>
        <Value>{value}</Value>
      </Box>
      <Form
        method="post"
        onSubmit={async (event) => {
          event.preventDefault();
          updateIdentity(identity);
        }}
      >
        <p>
          New{" "}
          {currentIdentity.type === ReceivedIdentityTypes.PHONE
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
        <Button
          className="send-button"
          variant={ButtonVariant.PRIMARY}
          type="submit"
        >
          Update {currentIdentity.type}
        </Button>
      </Form>
      <Button
        variant={ButtonVariant.SECONDARY}
        onClick={() => router.push("/account/logins/")}
      >
        Cancel
      </Button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 90%;
  margin: 0 auto;

  input {
    width: 100%;
    margin: ${({ theme }) => theme.spaces.component.xxs} 0;
  }

  button {
    width: 100%;
  }

  .send-button {
    margin: ${({ theme }) => theme.spaces.component.xxs} 0;
  }
`;
export const Form = styled.form`
  display: column;
  align-items: center;
`;

const Value = styled.p`
  margin-right: 0.5rem;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;
