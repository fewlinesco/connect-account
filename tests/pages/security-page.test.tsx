import fetch from "jest-fetch-mock";
import React from "react";

import { render, screen } from "../config/testing-library-config";
import { config } from "@src/config";
import SecurityPage from "@src/pages/account/security/index";

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
    fetch.once(JSON.stringify({ isPasswordSet: true }));

    render(<SecurityPage />);
    const securityElementList = await screen.findAllByText("Security");

    expect(securityElementList.length).toEqual(2);
    expect(
      await screen.findByText("Password, login history and more"),
    ).toBeInTheDocument();
    expect(await screen.findByText("Password")).toBeInTheDocument();
  });

  test("The anchor should render 'Update your password' if isPasswordSet is true", async () => {
    fetch.once(JSON.stringify({ isPasswordSet: true }));

    render(<SecurityPage />);
    const securityUpdateAnchor = await screen.findByText(
      "Update your password",
    );

    expect(securityUpdateAnchor.closest("a")).toHaveAttribute(
      "href",
      `${config.connectAccountURL}/account/security/update`,
    );
  });

  test("The anchor should render 'Set your password' if isPasswordSet is false", async () => {
    fetch.once(JSON.stringify({ isPasswordSet: false }));

    render(<SecurityPage />);
    const securityUpdateAnchor = await screen.findByText(
      "Update your password",
    );

    expect(securityUpdateAnchor).toBeInTheDocument();
  });
});
