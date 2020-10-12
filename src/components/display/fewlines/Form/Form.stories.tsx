import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { Container } from "../Container";
import { Input } from "../Input/Input";
import { Form } from "./Form";

export default { title: "Form", component: Form };

export const StandardForm = (): JSX.Element => {
  return (
    <StoryContainer>
      <Form
        onSubmit={async () => {
          return;
        }}
      >
        <Input type="text" name="value" placeholder={`Enter your email`} />
        <Button variant={ButtonVariant.PRIMARY} type="submit">
          Update email
        </Button>
      </Form>
    </StoryContainer>
  );
};

const StoryContainer = styled(Container)`
  button {
    margin: ${({ theme }) => theme.spaces.xxs} 0;
  }
`;
