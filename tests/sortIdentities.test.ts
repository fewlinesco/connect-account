import { ReceivedIdentityTypes } from "../src/@types/Identity";
import { sortIdentities } from "../src/utils/sortIdentities";
import { ProviderUser } from "@lib/@types";

describe("sortIdentities", () => {
  it("should sort identities properly", () => {
    const mockedResponse: { data: { provider: ProviderUser } } = {
      data: {
        provider: {
          id: "4a5f8589-0d91-4a69-924a-6f227a69666d",
          name: "Mocked Provider",
          user: {
            id: "299d268e-3e19-4486-9be7-29c539d241ac",
            identities: [
              {
                id: "7f8d168a-3f65-4636-9acb-7720a212680e",
                primary: true,
                status: "validated",
                type: ReceivedIdentityTypes.PHONE,
                value: "0123456789",
              },
              {
                id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
                primary: true,
                status: "validated",
                type: ReceivedIdentityTypes.EMAIL,
                value: "test@test.test",
              },
            ],
          },
        },
      },
    };

    const mockedSortedResponse = {
      emailIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
          status: "validated",
          type: ReceivedIdentityTypes.EMAIL,
          value: "test@test.test",
        },
      ],
      phoneIdentities: [
        {
          id: "7f8d168a-3f65-4636-9acb-7720a212680e",
          primary: true,
          status: "validated",
          type: ReceivedIdentityTypes.PHONE,
          value: "0123456789",
        },
      ],
    };

    const call = sortIdentities(mockedResponse);
    expect(call).toStrictEqual(mockedSortedResponse);
  });

  it("should render properly if it receives empty arrays", () => {
    const mockedResponse: { data: { provider: ProviderUser } } = {
      data: {
        provider: {
          id: "4a5f8589-0d91-4a69-924a-6f227a69666d",
          name: "Mocked Provider",
          user: {
            id: "299d268e-3e19-4486-9be7-29c539d241ac",
            identities: [],
          },
        },
      },
    };

    const mockedSortedResponse = {
      emailIdentities: [],
      phoneIdentities: [],
    };

    const call = sortIdentities(mockedResponse);
    expect(call).toStrictEqual(mockedSortedResponse);
  });

  it("should render properly if it receives only social logins", () => {
    const mockedResponse: { data: { provider: ProviderUser } } = {
      data: {
        provider: {
          id: "4a5f8589-0d91-4a69-924a-6f227a69666d",
          name: "Mocked Provider",
          user: {
            id: "299d268e-3e19-4486-9be7-29c539d241ac",
            identities: [
              {
                id: "7f8d168a-3f65-4636-9acb-7720a212680e",
                primary: true,
                status: "validated",
                type: ReceivedIdentityTypes.FACEBOOK,
                value: "test@test.test",
              },
              {
                id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
                primary: false,
                status: "validated",
                type: ReceivedIdentityTypes.GOOGLE,
                value: "test@test.test",
              },
            ],
          },
        },
      },
    };

    const mockedSortedResponse = {
      emailIdentities: [],
      phoneIdentities: [],
    };

    const call = sortIdentities(mockedResponse);
    expect(call).toStrictEqual(mockedSortedResponse);
  });

  it("should render properly if it receives only email", () => {
    const mockedResponse: { data: { provider: ProviderUser } } = {
      data: {
        provider: {
          id: "4a5f8589-0d91-4a69-924a-6f227a69666d",
          name: "Mocked Provider",
          user: {
            id: "299d268e-3e19-4486-9be7-29c539d241ac",
            identities: [
              {
                id: "7f8d168a-3f65-4636-9acb-7720a212680e",
                primary: true,
                status: "validated",
                type: ReceivedIdentityTypes.EMAIL,
                value: "test@fewlines.local",
              },
              {
                id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
                primary: false,
                status: "validated",
                type: ReceivedIdentityTypes.EMAIL,
                value: "test@test.test",
              },
            ],
          },
        },
      },
    };

    const mockedSortedResponse = {
      emailIdentities: [
        {
          id: "7f8d168a-3f65-4636-9acb-7720a212680e",
          primary: true,
          status: "validated",
          type: ReceivedIdentityTypes.EMAIL,
          value: "test@fewlines.local",
        },
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: false,
          status: "validated",
          type: ReceivedIdentityTypes.EMAIL,
          value: "test@test.test",
        },
      ],
      phoneIdentities: [],
    };

    const call = sortIdentities(mockedResponse);
    expect(call).toStrictEqual(mockedSortedResponse);
  });

  it("should render properly if it receive only phone", () => {
    const mockedResponse: { data: { provider: ProviderUser } } = {
      data: {
        provider: {
          id: "4a5f8589-0d91-4a69-924a-6f227a69666d",
          name: "Mocked Provider",
          user: {
            id: "299d268e-3e19-4486-9be7-29c539d241ac",
            identities: [
              {
                id: "7f8d168a-3f65-4636-9acb-7720a212680e",
                primary: true,
                status: "validated",
                type: ReceivedIdentityTypes.PHONE,
                value: "0123456789",
              },
              {
                id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
                primary: false,
                status: "validated",
                type: ReceivedIdentityTypes.PHONE,
                value: "0622116655",
              },
            ],
          },
        },
      },
    };

    const mockedSortedResponse = {
      emailIdentities: [],
      phoneIdentities: [
        {
          id: "7f8d168a-3f65-4636-9acb-7720a212680e",
          primary: true,
          status: "validated",
          type: ReceivedIdentityTypes.PHONE,
          value: "0123456789",
        },
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: false,
          status: "validated",
          type: ReceivedIdentityTypes.PHONE,
          value: "0622116655",
        },
      ],
    };

    const call = sortIdentities(mockedResponse);
    expect(call).toStrictEqual(mockedSortedResponse);
  });
});
