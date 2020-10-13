import React from "react";

import { Button, ButtonVariant } from "../Button/Button";
import { Container } from "../Container";
import { Input } from "../Input/Input";
import { Form } from "./Form";

export default { title: "components/Form", component: Form };

export const StandardForm = (): JSX.Element => {
  const [numberOfSubmit, setNumberOfSubmit] = React.useState(0);

  return (
    <Container>
      <Form
        onSubmit={async () => {
          setNumberOfSubmit(numberOfSubmit + 1);
        }}
      >
        <Input type="text" name="value" placeholder={`Enter your email`} />
        <Button variant={ButtonVariant.PRIMARY} type="submit">
          Update email
        </Button>
      </Form>
      <p>Number of submits: {numberOfSubmit}</p>
    </Container>
  );
};
