// import { mount } from "enzyme";
import userEvent from "@testing-library/user-event";
import React from "react";

import { Button, ButtonVariant } from "../../src/components/button/button";
import { Form } from "../../src/components/form/form";
import { render, screen } from "../config/testing-library-config";

describe("Form", () => {
  test("should prevent multiple submit", () => {
    let counter = 0;

    render(
      <Form
        onSubmit={async () => {
          counter += 1;
          return;
        }}
      >
        <Button
          className="send-button"
          variant={ButtonVariant.PRIMARY}
          type="submit"
        >
          Submit
        </Button>
      </Form>,
    );

    userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(counter).toEqual(1);

    userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(counter).toEqual(1);
  });
});
