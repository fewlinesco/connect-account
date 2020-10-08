import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { Box } from "../Box/Box";
import { Button, ButtonVariant } from "../Button/Button";
import { Container } from "../Container";
import { H1 } from "../H1/H1";
import { Input } from "../Input/Input";
import { NavigationBreadcrumbs } from "../NavigationBreadcrumbs/NavigationBreadcrumbs";
import { IdentityTypes } from "@lib/@types/Identity";
import { displayAlertBar } from "@src/utils/displayAlertBar";

const IdentityValidationForm: React.FC<{
  type: IdentityTypes;
  verifyIdentity: (validationCode: string) => Promise<void>;
}> = ({ type, verifyIdentity }) => {
  const [validationCode, setValidationCode] = React.useState("");

  const router = useRouter();

  return (
    <Container>
      <H1>Logins</H1>
      <NavigationBreadcrumbs
        breadcrumbs={[
          type.toUpperCase() === IdentityTypes.EMAIL
            ? "Email address"
            : "Phone number",
          "validation",
        ]}
      />
      <Form
        method="post"
        onSubmit={async (event) => {
          event.preventDefault();

          await verifyIdentity(validationCode);
        }}
      >
        {displayAlertBar(
          type.toUpperCase() === IdentityTypes.EMAIL
            ? "Confirmation email has been sent"
            : "confirmation SMS has been sent",
        )}

        <Box>
          <Value>Enter the validation code below</Value>
        </Box>
        <p>Validation code</p>
        <Input
          type="text"
          name="value"
          placeholder="012345"
          value={validationCode}
          onChange={(event) => setValidationCode(event.target.value)}
        />
        <Button
          variant={ButtonVariant.PRIMARY}
          type="submit"
        >{`Confirm ${type.toLowerCase()}`}</Button>
      </Form>
      <Button
        variant={ButtonVariant.SECONDARY}
        onClick={() => router.push("/account/logins/")}
      >
        Discard all changes
      </Button>
      <DidntReceiveCode>Didn&apos;t receive code?</DidntReceiveCode>
      <Button variant={ButtonVariant.SECONDARY}>
        Resend confirmation code
      </Button>
    </Container>
  );
};

export default IdentityValidationForm;

const DidntReceiveCode = styled.p`
  margin: ${({ theme }) => theme.spaces.xs} 0 ${({ theme }) => theme.spaces.xxs};
`;

const Value = styled.p`
  font-weight: ${({ theme }) => theme.fontWeights.light};
  font-size: ${({ theme }) => theme.fontSizes.s};
`;

export const Form = styled.form`
  display: column;
  align-items: center;
`;
