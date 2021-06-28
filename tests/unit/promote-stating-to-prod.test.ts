jest.mock("node-fetch");
import { promoteToProd } from "../../bin/promote-staging-to-prod";

const fetch = require("node-fetch"); // eslint-disable-line @typescript-eslint/no-var-requires

const mockResponse =
  (wantedResponse: { status: number; body: Record<string, string> }) => () =>
    Promise.resolve({
      status: wantedResponse.status,
      json: () => Promise.resolve(wantedResponse.body),
    });

const pendingPromotion = {
  id: "e2a67883-ef47-4da2-84af-a630310269ff",
  status: "pending",
};
const completedPromotion = {
  id: "e2a67883-ef47-4da2-84af-a630310269ff",
  status: "completed",
};

describe("#promoteStagingToProduction", () => {
  jest.spyOn(console, "log").mockImplementation(jest.fn);

  afterEach(() => {
    fetch.default.mockReset();
  });

  test("Return a success when the app is promoted", async () => {
    fetch.default.mockImplementationOnce(
      mockResponse({
        status: 200,
        body: pendingPromotion,
      }),
    );
    fetch.default.mockImplementationOnce(
      mockResponse({
        status: 200,
        body: completedPromotion,
      }),
    );
    const result = await promoteToProd();
    expect(result).toMatch("Sucessful promotion");
  });

  test("Return a success when the app is promoted, even after retries", async () => {
    fetch.default.mockImplementationOnce(
      mockResponse({
        status: 200,
        body: pendingPromotion,
      }),
    );
    fetch.default.mockImplementationOnce(
      mockResponse({
        status: 200,
        body: pendingPromotion,
      }),
    );
    fetch.default.mockImplementationOnce(
      mockResponse({
        status: 200,
        body: completedPromotion,
      }),
    );
    const result = await promoteToProd(5);
    expect(result).toMatch("Sucessful promotion");
  });

  test("Throws an error when the app is not promoted after the max retry value", async () => {
    fetch.default.mockImplementationOnce(
      mockResponse({
        status: 200,
        body: pendingPromotion,
      }),
    );

    const maxTry = 2;
    for (let i = 0; i <= maxTry; i++) {
      fetch.default.mockImplementationOnce(
        mockResponse({
          status: 200,
          body: pendingPromotion,
        }),
      );
    }

    try {
      await promoteToProd(maxTry);
    } catch (error) {
      expect(error.message).toMatch(
        `The staging app hasn't been promoted after ${maxTry}.`,
      );
    }
  });

  test("Throws an error when the app when provided with wrong credential", async () => {
    expect.assertions(1);

    fetch.default.mockImplementationOnce(
      mockResponse({
        status: 401,
        body: {
          id: "unauthorized",
          message: "Invalid credentials provided.",
        },
      }),
    );

    try {
      await promoteToProd();
    } catch (error) {
      expect(error.message).toMatch("Unauthorized");
    }
  });

  test("Throws an error when the promotion doesn't exist provided with wrong credential", async () => {
    expect.assertions(1);

    fetch.default.mockImplementationOnce(
      mockResponse({
        status: 200,
        body: pendingPromotion,
      }),
    );
    fetch.default.mockImplementationOnce(
      mockResponse({
        status: 404,
        body: {},
      }),
    );

    try {
      await promoteToProd();
    } catch (error) {
      expect(error.message).toMatch("Targeted promotion-status doesn't exist");
    }
  });
});
