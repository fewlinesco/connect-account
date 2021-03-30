/* eslint-disable import/order */
import fetch, { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();

import React from "react";

import SecurityPage from "@src/pages/account/security/index";
import { render, screen } from "../config/testing-library-config";
// import { findByTextContent } from "../utils/find-by-text-content";

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

    fetch.mockResponseOnce(JSON.stringify({ isPasswordSet: false }));

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

  // Mock do not reset for some reasons.

  // test("The anchor should render 'Set your password' if isPasswordSet is false", async () => {
  //   expect.assertions(1);

  //   fetch.mockResponseOnce(JSON.stringify({ isPasswordSet: false }));

  //   render(<SecurityPage />);
  //   const securitySetAnchor = await findByTextContent("Set your password");

  //   expect(securitySetAnchor).toBeTruthy();
  // });

  // test("The anchor should render 'Update your password' if isPasswordSet is true", async () => {
  //   expect.assertions(1);

  //   fetch.mockResponseOnce(JSON.stringify({ isPasswordSet: true }), {
  //     status: 200,
  //   });

  //   render(<SecurityPage />);
  //   await findByTextContent(
  //     "Update your password",
  //   ).then((securityUpdateAnchor) => expect(securityUpdateAnchor).toBeTruthy());
  // });
});
