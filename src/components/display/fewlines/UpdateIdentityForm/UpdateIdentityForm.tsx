import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { Container } from "../Container";
import { H1 } from "../H1/H1";
import { Input } from "../Input/Input";
import { NavigationBreadcrumbs } from "../NavigationBreadcrumbs/NavigationBreadcrumbs";
import { Identity, IdentityTypes } from "@lib/@types";
import { Box } from "@src/components/display/fewlines/Box/Box";

export const UpdateIdentityForm: React.FC<{
  updateIdentity: (newValue: string) => Promise<void>;
  currentIdentity: Identity;
}> = ({ currentIdentity, updateIdentity }) => {
  const [identity, setIdentity] = React.useState("");
  const router = useRouter();
  const { value } = currentIdentity;

  return (
    <Container>
      <H1>Logins</H1>
      <NavigationBreadcrumbs
        breadcrumbs={[
          currentIdentity.type === IdentityTypes.EMAIL
            ? "Email address"
            : "Phone number",
          "edit",
        ]}
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
      <Button
        variant={ButtonVariant.SECONDARY}
        onClick={() => router.push("/account/logins/")}
      >
        Cancel
      </Button>
    </Container>
  );
};

export const Form = styled.form`
  display: column;
  align-items: center;
`;

const Value = styled.p`
  margin-right: 0.5rem;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;
