import React from "react";

import { Button, ButtonVariant } from "../buttons/buttons";
import { StoriesContainer } from "../containers/stories-container";
import { InputText } from "../input/input-text";
import { Form } from "./form";

const StandardForm = (): JSX.Element => {
  const [numberOfSubmit, setNumberOfSubmit] = React.useState(0);
  const [emailValue, setEmailValue] = React.useState("");

  return (
    <StoriesContainer>
      <Form
        onSubmit={async () => {
          setNumberOfSubmit(numberOfSubmit + 1);
        }}
      >
        <InputText
          type="email"
          name="value"
          value={emailValue}
          placeholder={`Enter your email`}
          onChange={(value) => {
            setEmailValue(value);
          }}
          label="New email address *"
        />
        <Button variant={ButtonVariant.PRIMARY} type="submit">
          Update email
        </Button>
      </Form>
      <p>Number of submits: {numberOfSubmit}</p>
    </StoriesContainer>
  );
};

export { StandardForm };
export default { title: "components/Form", component: Form };
