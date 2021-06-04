import { generateHS256JWS } from "@fewlines/connect-client";

import {
  Configuration,
  ConnectProfileApi,
} from "../../../connect-profile-client";
import { initProfileClient } from "@src/configs/profile-client";

const getAccessToken = (
  sub: string,
  clientSecret: string,
  scope = "openid address profile",
): string => {
  const jwtPayload = { sub, scope };
  return generateHS256JWS(jwtPayload, clientSecret);
};

describe("Mock Server", () => {
  let client: ConnectProfileApi;
  const clientSecret = "fake-client-secret";
  const accessToken = getAccessToken("fake-sub", clientSecret);
  beforeAll(() => {
    client = initProfileClient(accessToken);
  });

  describe("Profiles domain's happy paths", () => {
    describe("GET /users/me/profile", () => {
      it("Should respond with a 200", async () => {
        expect.assertions(2);

        const { status, data } = await client.getProfile();
        expect(status).toBe(200);
        expect(data.nickname).toBe("Superman");
      });
    });

    describe("POST /users/me/profile", () => {
      it("Should respond with a 201", async () => {
        expect.assertions(1);

        const { status } = await client.createProfile({});
        expect(status).toBe(201);
      });
    });

    describe("PATCH /users/me/profile", () => {
      it("Should respond with a 200", async () => {
        expect.assertions(1);

        const { status } = await client.patchProfile({});
        expect(status).toBe(200);
      });
    });
  });

  describe("Addresses domain's happy paths", () => {
    describe("GET /users/me/addresses", () => {
      it("Should respond with a 200", async () => {
        expect.assertions(2);

        const { status, data } = await client.getAddresses();
        expect(status).toBe(200);
        expect(Array.isArray(data)).toBe(true);
      });
    });

    describe("POST /users/me/addresses", () => {
      it("Should respond with a 201", async () => {
        const { status, data } = await client.createAddress({
          country: "fake",
          locality: "fake",
          postal_code: "fake",
        });
        expect(status).toBe(201);
        expect(data.locality).toBe("Metropolis");
      });
    });
  });

  describe("General Client Errors", () => {
    it("Should respond with 404 when Prefer header is set to 'code=404'", async () => {
      expect.assertions(2);

      try {
        await client.getProfile({
          headers: {
            Prefer: "code=404",
          },
        });
      } catch (error) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.error).toBe("User not found");
      }
    });

    it("Should respond with 401 when no provided with an accessToken", async () => {
      expect.assertions(2);

      const noAuthToken = new ConnectProfileApi(
        new Configuration({
          basePath: process.env.CONNECT_PROFILE_URL,
        }),
      );

      try {
        await noAuthToken.getProfile();
      } catch (error) {
        expect(error.response.status).toBe(401);
        expect(error.response.data.error).toBe(
          "Without a valid bearer token you are not allowed to access this endpoint",
        );
      }
    });
  });
});
