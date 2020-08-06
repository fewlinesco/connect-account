import { ReceivedIdentityTypes } from "../../src/@types/Identity";
import { ProviderUser } from "../../src/@types/ProviderUser";

export const mockedSortedResponse = {
  emailIdentities: [
    {
      id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
      primary: true,
      status: "validated",
      type: "email",
      value: "test@test.test",
    },
  ],
  phoneIdentities: [
    {
      id: "7f8d168a-3f65-4636-9acb-7720a212680e",
      primary: true,
      status: "validated",
      type: "phone",
      value: "0123456789",
    },
  ],
};

export const mockedResponse: { data: { provider: ProviderUser } } = {
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
