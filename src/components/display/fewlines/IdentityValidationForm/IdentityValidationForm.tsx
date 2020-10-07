import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { Box } from "../Box/Box";
import { Button, ButtonVariant } from "../Button/Button";
import { Container } from "../Container";
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
    <Wrapper>
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

          <Box className="instructions">Enter the validation code below</Box>
          <p>Validation code</p>
          <Input
            type="text"
            name="value"
            placeholder="012345"
            value={validationCode}
            onChange={(event) => setValidationCode(event.target.value)}
          />
          <Button
            className="send-button"
            variant={ButtonVariant.PRIMARY}
            type="submit"
          >{`Confirm ${type.toLowerCase()}`}</Button>
        </Form>
        <Button
          className="discard-button"
          variant={ButtonVariant.SECONDARY}
          onClick={() => router.push("/account/logins/")}
        >
          Discard all changes
        </Button>
        <DidntReceiveCode className="didnt-receive-code">
          Didn&apos;t receive code?
        </DidntReceiveCode>
        <Button className="resend-button" variant={ButtonVariant.SECONDARY}>
          Resend confirmation code
        </Button>
      </Container>
    </Wrapper>
  );
};

export default IdentityValidationForm;

const H1 = styled.h1`
  margin: ${({ theme }) => theme.spaces.component.s} 0
    ${({ theme }) => theme.spaces.component.xxs};
`;

const DidntReceiveCode = styled.p`
  margin: ${({ theme }) => theme.spaces.component.xs} 0
    ${({ theme }) => theme.spaces.component.xxs};
`;

const Wrapper = styled.div`
  .instructions {
    font-weight: ${({ theme }) => theme.fontWeights.light};
    font-size: ${({ theme }) => theme.fontSizes.s};
  }
`;

export const Form = styled.form`
  display: column;
  align-items: center;
`;
