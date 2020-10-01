import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { Input } from "../Input/Input";
import { Form } from "./Form";

export default { title: "Form", component: Form };

export const StandardForm = (): JSX.Element => {
  return (
    <Container>
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
    </Container>
  );
};

const Container = styled.div`
  width: 90%;
  margin: 0 auto;

  form {
    display: flex;
    flex-direction: column;

    button {
      margin: ${({ theme }) => theme.spaces.component.xxs} 0;
    }
  }
`;
