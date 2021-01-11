import { IdentityTypes, ProviderUser } from "@lib/@types";
import { isMarkingIdentityAsPrimaryAuthorized } from "@src/utils/is-marking-identity-as-primary-authorized";

const userSub = "c396885b-18c7-43d6-ba4b-1b8fe4f7b66b";
const mockedResponse: { data: { provider: ProviderUser } } = {
  data: {
    provider: {
      id: "4a5f8589-0d91-4a69-924a-6f227a69666d",
      name: "Mocked Provider",
      user: {
        id: userSub,
        identities: [
          {
            id: "be90006d-b0d8-44bd-80a9-084048ee1cb8",
            primary: true,
            status: "validated",
            type: IdentityTypes.EMAIL,
            value: "foo@fewlines.test",
          },
        ],
      },
    },
  },
};

jest.mock("@src/utils/fetch-management.ts", () => {
  return {
    fetchManagement: () => {
      return mockedResponse;
    },
  };
});

describe("isMarkingIdentityAsPrimaryAuthorized", () => {
  test("should return true if `identityId` is part of user identities", async (done) => {
    expect.assertions(1);

    const identityId = "be90006d-b0d8-44bd-80a9-084048ee1cb8";
    const isAuthorized = await isMarkingIdentityAsPrimaryAuthorized(
      userSub,
      identityId,
    );

    expect(isAuthorized).toBe(true);

    done();
  });

  test("should return false if `identityId` is not part of user identities", async (done) => {
    expect.assertions(1);

    const identityId = "228ad77d-8bfd-4a46-ab36-8c03b783ee77";
    const isAuthorized = await isMarkingIdentityAsPrimaryAuthorized(
      userSub,
      identityId,
    );

    expect(isAuthorized).toBe(false);

    done();
  });
});
