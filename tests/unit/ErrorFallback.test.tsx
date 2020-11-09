import { mount } from "enzyme";
import React from "react";

import { ErrorFallback } from "@src/components/display/fewlines/ErrorFallback/ErrorFallback";
import { AccountApp } from "@src/pages/_app";

describe("ErrorFallback component", () => {
  test("should render the right content for 404 status code error", () => {
    expect.assertions(4);
    const component = mount(
      <AccountApp>
        <ErrorFallback statusCode={404} />
      </AccountApp>,
    );

    const title = component.find("h2");
    expect(title).toHaveLength(1);
    expect(title.text()).toStrictEqual(
      "We can't find the page you are looking for.",
    );

    const text = component.find("p");
    expect(text).toHaveLength(1);
    expect(text.exists("a[href='/']")).toEqual(true);
  });

  test("should render the right content for others status code error", () => {
    expect.assertions(2);
    const component = mount(
      <AccountApp>
        <ErrorFallback statusCode={500} />
      </AccountApp>,
    );

    const title = component.find("h2");
    expect(title).toHaveLength(1);
    expect(title.text()).toStrictEqual(
      "Something went wrong. We are working on getting this fixed as soon as we can.",
    );
  });
});
