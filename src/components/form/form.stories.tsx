import React from "react";

import { Button, ButtonVariant } from "../button/button";
import { StoriesContainer } from "../containers/stories-container";
import { Input } from "../input/input";
import { Form } from "./form";

export default { title: "components/Form", component: Form };

export const StandardForm = (): JSX.Element => {
  const [numberOfSubmit, setNumberOfSubmit] = React.useState(0);

  return (
    <StoriesContainer>
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
    </StoriesContainer>
  );
};
