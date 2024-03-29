import userEvent from "@testing-library/user-event";
import React from "react";

import { Button } from "../../src/components/buttons";
import { Form } from "../../src/components/forms/form";
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
        <Button className="btn btn-primary" type="submit">
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
