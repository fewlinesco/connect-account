/* eslint-disable import/order */
import fetch, { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();

import React from "react";

import { render, screen } from "../config/testing-library-config";
import { findByTextContent } from "../utils/find-by-text-content";
import SecurityPage from "@src/pages/account/security";

jest.mock("@src/configs/db-client", () => {
  return {
    dynamoDbClient: {
      send: () => {
        return;
      },
    },
  };
});

describe("SecurityPage", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test("It should render the security layout", async () => {
    expect.assertions(3);

    fetch.once(JSON.stringify({ isPasswordSet: false }));

    render(<SecurityPage />);

    await screen
      .findAllByText("Security")
      .then((securityElementList) =>
        expect(securityElementList.length).toEqual(2),
      );
    expect(
      await screen.findByText("Password, login history and more"),
    ).toBeInTheDocument();
    expect(await screen.findByText("Password")).toBeInTheDocument();
  });

  test("The anchor should render 'Set your password' if isPasswordSet is false", async () => {
    expect.assertions(1);

    fetch.once(JSON.stringify({ isPasswordSet: false }));

    render(<SecurityPage />);

    const securitySetAnchor = await findByTextContent("Set your password");

    expect(securitySetAnchor).toBeTruthy();
  });

  // Mocked fetch do not reset for some reasons.

  // test("The anchor should render 'Update your password' if isPasswordSet is true", async () => {
  //   expect.assertions(1);

  //   fetch.once(JSON.stringify({ isPasswordSet: true }));

  //   render(<SecurityPage />);
  //   await findByTextContent(
  //     "Update your password",
  //   ).then((securityUpdateAnchor) => expect(securityUpdateAnchor).toBeTruthy());
  // });
});
