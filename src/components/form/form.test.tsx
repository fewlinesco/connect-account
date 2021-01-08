import { mount } from "enzyme";
import React from "react";

import { Button, ButtonVariant } from "../button/button";
import { Input } from "../input/input";
import { Form } from "./form";
import { AccountApp } from "@src/pages/_app";

describe("Form", () => {
  test("should prevent multiple submit", () => {
    expect.assertions(3);

    let counter = 0;

    const DOM = mount(
      <AccountApp>
        <Form
          onSubmit={async () => {
            counter += 1;
            return;
          }}
        >
          <Input
            type="text"
            name="value"
            defaultValue=""
            onChange={() => {
              () => {
                return;
              };
            }}
          />
          <Button
            className="send-button"
            variant={ButtonVariant.PRIMARY}
            type="submit"
          />
        </Form>
      </AccountApp>,
    );

    const form = DOM.find(Form);
    expect(form).toHaveLength(1);

    form.simulate("submit");
    expect(counter).toEqual(1);
    form.simulate("submit");
    expect(counter).toEqual(1);
  });
});
